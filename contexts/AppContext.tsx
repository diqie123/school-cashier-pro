
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { Notification } from '../types';

interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, toggleTheme] = useDarkMode();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, notifications, addNotification, removeNotification }}>
      {children}
    </AppContext.Provider>
  );
};
