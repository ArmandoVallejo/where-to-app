import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const THEME_STORAGE_KEY = '@app_theme';

// Define custom light theme
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6B46C1',
    secondary: '#A855F7',
    tertiary: '#E9D5FF',
    background: '#f9fafb',
    surface: '#ffffff',
    surfaceVariant: '#f3f4f6',
    error: '#dc2626',
    success: '#16a34a',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#1f2937',
    onSurface: '#1f2937',
    outline: '#d1d5db',
    text: '#1f2937',
    textSecondary: '#6b7280',
    card: '#ffffff',
    border: '#e5e7eb',
  },
  dark: false,
};

// Define custom dark theme
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#A855F7',
    secondary: '#6B46C1',
    tertiary: '#4C1D95',
    background: '#111827',
    surface: '#1f2937',
    surfaceVariant: '#374151',
    error: '#ef4444',
    success: '#22c55e',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#f9fafb',
    onSurface: '#f9fafb',
    outline: '#4b5563',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    card: '#1f2937',
    border: '#374151',
  },
  dark: true,
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from AsyncStorage on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemePreference = async (isDark) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveThemePreference(newTheme);
  };

  const setTheme = (themeName) => {
    const isDark = themeName === 'Oscuro';
    setIsDarkMode(isDark);
    saveThemePreference(isDark);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { lightTheme, darkTheme };
