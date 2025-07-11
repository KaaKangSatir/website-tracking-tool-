
import { supabase } from "@/integrations/supabase/client";

export const createSecureUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating secure user:', error);
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const validateApiKey = async (apiKey: string) => {
  try {
    const { data, error } = await supabase.rpc('validate_api_key_usage', {
      api_key: apiKey
    });

    if (error) {
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error validating API key:', error);
    throw error;
  }
};

export const createApiKey = async (name: string, rateLimit: number = 100) => {
  try {
    const apiKey = generateRandomString(32);
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          key: apiKey,
          rate_limit: rateLimit,
          rate_window: 900 // 15 minutes
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
