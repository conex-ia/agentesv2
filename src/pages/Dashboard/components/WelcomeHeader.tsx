import React from 'react';
import { useUser } from '../../../hooks/useUser';
import ThemeToggle from '../../../components/ThemeToggle';

interface UserData {
  name?: string;
}

const WelcomeHeader: React.FC = () => {
  const { userData } = useUser();
  const userName = (userData as UserData)?.name || '';

  return (
    <div className="mx-auto px-6 py-6">
      <div className="rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Olá, {userName}!
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Bem-vindo(a) ao seu dashboard
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader; 