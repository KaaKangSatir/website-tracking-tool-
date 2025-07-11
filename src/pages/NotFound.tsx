
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertTriangle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 text-center space-y-8 animate-fade-in">
        {/* 404 Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce card-3d">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold animated-3d-text gradient-text">
            404
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-bold animated-3d-text glow-text mb-4">
            {t('page_not_found')}
          </h2>
          
          <p className="text-xl md:text-2xl animated-3d-text-subtle glow-text-blue max-w-2xl mx-auto">
            {t('page_vanished')}
          </p>
          
          <p className="text-lg glow-text-blue max-w-lg mx-auto">
            {t('wrong_turn')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group button-3d">
                <Home className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="animated-3d-text-small glow-text">{t('go_home')}</span>
              </Button>
            </Link>
            
            <Link to="/generator">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 group button-3d"
              >
                <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="animated-3d-text-small glow-text">{t('create_link')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto border border-white/10 card-3d">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400 mr-2 animate-pulse" />
            <h3 className="text-lg font-semibold animated-3d-text-small glow-text">{t('did_you_know')}</h3>
            <Sparkles className="w-6 h-6 text-yellow-400 ml-2 animate-pulse" />
          </div>
          <p className="glow-text-blue text-sm">
            {t('fun_fact')}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="glow-text-blue text-sm">
            {t('lost_help')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
