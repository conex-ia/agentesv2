import React, { useEffect } from 'react';
import useTheme from '../stores/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Aplica o tema inicial antes do React montar
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;