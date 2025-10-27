import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { username, password: pass });
      const { token: newToken, user: loggedInUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      return true;

    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
