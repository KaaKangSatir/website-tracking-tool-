import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, BarChart3, Loader2, ArrowLeft, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import supabase from '../utils/database';

const ShortlinkGenerator = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [webhook, setWebhook] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerate = async () => {
    if (!originalUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const code = shortCode || generateShortCode();
      const shortLink = `${window.location.origin}/s/${code}`;
      
      console.log('Inserting data:', {
        original_url: originalUrl,
        short_code: code,
        webhook: webhook || null,
      });

      const { data, error } = await supabase
        .from('yuuka')
        .insert([{
          original_url: originalUrl,
          short_code: code,
          webhook: webhook || null,
        }])
        .select();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Error",
          description: `Failed to save the short link: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Successfully inserted:', data);
      setGeneratedLink(shortLink);
      toast({
        title: "Success",
        description: "Short link generated and saved successfully!",
      });
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "Copied",
      description: "Short link copied to clipboard!",
    });
  };

  const openLink = () => {
    window.open(generatedLink, '_blank');
  };

  const openDashboard = () => {
    const code = generatedLink.split('/s/')[1];
    if (code) {
      window.open(`/dashboard/${code}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <Link to="/" className="inline-flex items-center glow-text-blue hover:glow-text-purple transition-colors duration-200 button-3d">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="animated-3d-text-small">{t('back_to_home')}</span>
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 card-3d">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce card-3d">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold animated-3d-text glow-text">{t('create_magic_link_title')}</CardTitle>
            <CardDescription className="glow-text-blue">
              {t('transform_url_desc')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="url" className="animated-3d-text-small glow-text font-medium">{t('original_url')}</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="shortcode" className="animated-3d-text-small glow-text font-medium">{t('custom_code')}</Label>
              <Input
                id="shortcode"
                placeholder="my-custom-link"
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="webhook" className="animated-3d-text-small glow-text font-medium">{t('discord_webhook')}</Label>
              <Input
                id="webhook"
                placeholder="Discord webhook URL"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-purple-400 transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group button-3d"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span className="animated-3d-text-small glow-text">{t('creating_magic')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="animated-3d-text-small glow-text">{t('generate_link')}</span>
                </>
              )}
            </Button>

            {generatedLink && (
              <div className="space-y-4 p-6 bg-white/10 backdrop-blur-lg rounded-lg border-white/20 card-3d">
                <Label className="animated-3d-text-small glow-text font-medium flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-green-400" />
                  {t('your_magic_link')}
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="flex-1 bg-white/10 border-white/20 text-white"
                  />
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="button-3d bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={openLink}
                    className="button-3d bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={openDashboard}
                  variant="secondary"
                  size="sm"
                  className="w-full button-3d bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="animated-3d-text-small glow-text">{t('view_analytics_dashboard')}</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-6">
        <p className="glow-text-blue text-sm">{t('powered_by')}</p>
      </div>
    </div>
  );
};

export default ShortlinkGenerator;
