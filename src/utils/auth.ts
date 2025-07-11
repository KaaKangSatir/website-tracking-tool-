
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';

export const generateApiKey = async (): Promise<string> => {
  const apiKey = `sk_${nanoid(32)}`;
  
  try {
    const { error } = await supabase
      .from('api_keys')
      .insert({
        key: apiKey,
        name: 'Generated Key',
        is_active: true,
        rate_limit: 1000,
        rate_window: 3600
      });

    if (error) {
      console.error('Error storing API key:', error);
      throw new Error('Failed to store API key');
    }

    return apiKey;
  } catch (error) {
    console.error('Error generating API key:', error);
    throw error;
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return false;
    }

    // Update last_used_at and usage_count
    await supabase
      .from('api_keys')
      .update({
        last_used_at: new Date().toISOString(),
        usage_count: (data.usage_count || 0) + 1
      })
      .eq('id', data.id);

    return true;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};
