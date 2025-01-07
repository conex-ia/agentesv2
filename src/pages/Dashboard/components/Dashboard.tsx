import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div 
          className="backdrop-blur-sm bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-6"
        >
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Olá, Flavio Guardia!
          </h1>
          <p className="text-[var(--text-secondary)]">
            Bem-vindo(a) ao seu dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;