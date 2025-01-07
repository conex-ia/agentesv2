import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../stores/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors bg-[#1F2937] text-gray-400"
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-400" />
      )}
    </button>
  );
};

export default ThemeToggle; 