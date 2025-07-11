import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, ExternalLink, Eye, Globe, TrendingUp, Users, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalClicks: number;
  uniqueVisitors: number;
  conversionRate: number;
  recentActivity: any[];
  topLocations: any[];
  clicksOverTime: any[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    recentActivity: [],
    topLocations: [],
    clicksOverTime: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all tracking data
        const { data: trackingData, error } = await supabase
          .from('tracking_data')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tracking data:', error);
          return;
        }

        if (!trackingData) {
          setIsLoading(false);
          return;
        }

        // Calculate stats
        const totalClicks = trackingData.length;
        const uniqueIPs = new Set(trackingData.map(d => d.ip_address).filter(Boolean));
        const uniqueVisitors = uniqueIPs.size;
        const conversionRate = totalClicks > 0 ? ((uniqueVisitors / totalClicks) * 100) : 0;

        // Recent activity (last 10)
        const recentActivity = trackingData.slice(0, 10).map(item => ({
          id: item.id,
          type: item.type,
          location: item.latitude && item.longitude 
            ? `${item.latitude.toFixed(2)}, ${item.longitude.toFixed(2)}`
            : 'Unknown',
          device: getDeviceType(item.user_agent),
          time: formatDate(item.created_at)
        }));

        // Top locations
        const locationCounts: { [key: string]: number } = {};
        trackingData.forEach(item => {
          if (item.latitude && item.longitude) {
            const location = `${item.latitude.toFixed(1)}, ${item.longitude.toFixed(1)}`;
            locationCounts[location] = (locationCounts[location] || 0) + 1;
          }
        });

        const topLocations = Object.entries(locationCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([location, count]) => ({ location, count }));

        // Clicks over time (last 7 days)
        const clicksOverTime = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = date.toISOString().split('T')[0];
          
          const dayClicks = trackingData.filter(item => 
            item.created_at.startsWith(dateStr)
          ).length;

          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            clicks: dayClicks
          };
        });

        setStats({
          totalClicks,
          uniqueVisitors,
          conversionRate,
          recentActivity,
          topLocations,
          clicksOverTime
        });
      } catch (error) {
        console.error('Error in fetchDashboardData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDeviceType = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown';
    if (/Mobile|Android|iPhone/i.test(userAgent)) return 'Mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="animated-3d-text-small glow-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 animated-3d-text gradient-text">{t('shortlink_dashboard')}</h1>
          <p className="text-lg animated-3d-text-subtle glow-text-blue">{t('dashboard_subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium animated-3d-text-small glow-text">{t('total_clicks')}</CardTitle>
              <Eye className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animated-3d-text glow-text-green">{stats.totalClicks}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium animated-3d-text-small glow-text">{t('unique_visitors')}</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animated-3d-text glow-text-blue">{stats.uniqueVisitors}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium animated-3d-text-small glow-text">{t('conversion_rate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animated-3d-text glow-text-purple">{stats.conversionRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Click Analytics */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 animated-3d-text glow-text">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                {t('click_analytics')}
              </CardTitle>
              <CardDescription className="glow-text-blue">
                {t('clicks_over_time')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.clicksOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 animated-3d-text glow-text">
                <Globe className="w-5 h-5 text-pink-400" />
                {t('top_locations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topLocations.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.topLocations}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {stats.topLocations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {stats.topLocations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="animated-3d-text-small glow-text text-sm">{location.location}</span>
                        </div>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                          <span className="glow-text-blue">{location.count}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="glow-text-blue text-center py-8">{t('no_data')}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 animated-3d-text glow-text">
              <Eye className="w-5 h-5 text-green-400" />
              {t('recent_activity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                        <span className="animated-3d-text-small glow-text">{activity.type}</span>
                      </Badge>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        <span className="animated-3d-text-small glow-text text-sm">{t('visitor_info')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm glow-text-blue">{t('location')}: {activity.location}</div>
                      <div className="text-sm glow-text-blue">{t('device')}: {activity.device}</div>
                      <div className="text-sm glow-text-blue">{t('time')}: {activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="glow-text-blue text-center py-8">{t('no_data')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
