
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link as LinkIcon, Zap, Shield, BarChart3, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo and brand */}
          <div className="space-y-4">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce card-3d">
              <LinkIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-4 animated-3d-text gradient-text">
              ShortLink
            </h1>
            
            <p className="text-xl md:text-2xl animated-3d-text-subtle glow-text-blue font-light max-w-2xl mx-auto">
              {t('tools_beyond_imagination')}
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 card-3d">
              <CardHeader className="text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="animated-3d-text-small glow-text">{t('advanced_tracking')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="glow-text-blue text-sm">{t('advanced_tracking_desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 card-3d delay-200">
              <CardHeader className="text-center">
                <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <CardTitle className="animated-3d-text-small glow-text">{t('real_time_data')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="glow-text-blue text-sm">{t('real_time_data_desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 card-3d delay-500">
              <CardHeader className="text-center">
                <Globe className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <CardTitle className="animated-3d-text-small glow-text">{t('global_reach')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="glow-text-blue text-sm">{t('global_reach_desc')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <Link to="/generator" className="block">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group button-3d">
                <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="animated-3d-text-small glow-text">{t('create_magic_link')}</span>
                <Zap className="ml-3 h-6 w-6 group-hover:scale-125 transition-transform duration-300" />
              </Button>
            </Link>
            
            <p className="glow-text-blue text-sm max-w-md mx-auto leading-relaxed">
              {t('transform_urls')}
            </p>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 animated-3d-text glow-text-green">10K+</div>
              <div className="glow-text-blue text-sm">{t('links_created')}</div>
            </div>
            <div className="text-center delay-200">
              <div className="text-3xl font-bold mb-1 animated-3d-text glow-text-green">99.9%</div>
              <div className="glow-text-blue text-sm">{t('uptime')}</div>
            </div>
            <div className="text-center delay-500">
              <div className="text-3xl font-bold mb-1 animated-3d-text glow-text-green">24/7</div>
              <div className="glow-text-blue text-sm">{t('support')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="glow-text-blue text-sm">{t('powered_by')}</p>
      </div>
    </div>
  );
};

export default Index;
