import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { getCurrentUser, isAuthenticated, logout } from '../services/auth';
import { setOnTokenRefreshed } from '../services/authHelpers';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoggedIn: false,
  setUser: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (isAuthenticated()) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Check authentication status on mount
  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    setOnTokenRefreshed(refreshUser);
    return () => setOnTokenRefreshed(null);
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    setUser,
    logout: handleLogout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);