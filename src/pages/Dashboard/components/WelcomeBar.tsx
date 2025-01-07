import React from 'react';
import ThemeToggle from '../../../components/ThemeToggle';

interface WelcomeBarProps {
  userName: string;
}

const WelcomeBar: React.FC<WelcomeBarProps> = ({ userName }) => {
  return (
    <div 
      className="rounded-lg p-6 border backdrop-blur-sm flex items-center justify-between"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        color: 'var(--text-primary)'
      }}
    >
      <div>
        <h1 
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Olá, {userName}!
        </h1>
        <p 
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Bem-vindo(a) ao seu dashboard
        </p>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default WelcomeBar;