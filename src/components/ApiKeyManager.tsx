
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateApiKey, validateApiKey } from '../utils/auth';
import { useSecurityContext } from './SecurityProvider';

const ApiKeyManager: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const { apiKey, setApiKey } = useSecurityContext();
  const { toast } = useToast();

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const newKey = await generateApiKey();
      setApiKey(newKey);
      toast({
        title: "API Key Generated",
        description: "Your new API key has been generated and saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidateKey = async () => {
    if (!inputKey) {
      toast({
        title: "Error",
        description: "Please enter an API key to validate.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isValid = await validateApiKey(inputKey);
      if (isValid) {
        setApiKey(inputKey);
        setInputKey('');
        toast({
          title: "API Key Valid",
          description: "Your API key has been validated and saved.",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided API key is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate API key.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "API key copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Secure your database access with API keys. Generate or validate your API key below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKey && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-green-800">Current API Key</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-white px-2 py-1 rounded text-sm font-mono flex-1">
                  {showKey ? apiKey : '*'.repeat(apiKey.length)}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Generate New API Key</h3>
              <Button
                onClick={handleGenerateKey}
                disabled={isGenerating}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate API Key'}
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Validate Existing API Key</h3>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleValidateKey}>
                  Validate
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Security Tips</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Keep your API key secret and never share it publicly</li>
              <li>• Use different API keys for different environments</li>
              <li>• Regularly rotate your API keys for better security</li>
              <li>• Monitor your API usage for suspicious activity</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManager;
