import React from 'react';
import { phaseIcons, phaseMessages } from '../constants';

interface StatusIndicatorProps {
  phase: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ phase }) => {
  const normalizedPhase = phase === 'Em progresso' ? 'aguardando' : phase;
  const Icon = phaseIcons[normalizedPhase] || phaseIcons['aguardando'];
  const message = normalizedPhase === 'aguardando' ? 'Aguardando' : (phaseMessages[normalizedPhase] || normalizedPhase);

  const getStatusColor = () => {
    if (normalizedPhase.includes('erro')) {
      return {
        bg: 'var(--status-error-bg)',
        color: 'var(--status-error-color)'
      };
    }
    if (normalizedPhase === 'finalizado') {
      return {
        bg: 'var(--status-success-bg)',
        color: 'var(--status-success-color)'
      };
    }
    if (normalizedPhase === 'aguardando') {
      return {
        bg: 'var(--status-warning-bg)',
        color: 'var(--status-warning-color)'
      };
    }
    return {
      bg: 'var(--status-success-bg)',
      color: 'var(--status-success-color)'
    };
  };

  const { bg, color } = getStatusColor();

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <span style={{ color: 'var(--text-primary)' }}>{message}</span>
    </div>
  );
};

export { StatusIndicator };