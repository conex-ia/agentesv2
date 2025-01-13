import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../stores/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-secondary"
      aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-text-primary" />
      ) : (
        <Moon size={20} className="text-text-primary" />
      )}
    </button>
  );
};

export default ThemeToggle; 