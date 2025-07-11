
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, AuthUser } from '../utils/auth';

interface SecurityContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  apiKey: string | null;
  setApiKey: (key: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('yuuka_api_key')
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('yuuka_api_key', key);
  };

  return (
    <SecurityContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      apiKey,
      setApiKey: handleSetApiKey
    }}>
      {children}
    </SecurityContext.Provider>
  );
};
