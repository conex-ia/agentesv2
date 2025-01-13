import React, { useEffect } from 'react';
import useTheme from '../stores/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Atualiza o atributo data-theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualiza a classe do tema no body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <div className={`${theme} bg-primary min-h-screen`}>{children}</div>;
};

export default ThemeProvider;