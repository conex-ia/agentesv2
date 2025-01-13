import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const isError = status.includes('erro');
  const isFinished = status === 'finalizado';

  if (isError) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: 'var(--status-error-bg)',
            boxShadow: '0 4px 14px 0 var(--accent-color-transparent)'
          }}
        >
          <AlertCircle 
            size={24} 
            className="transition-colors"
            style={{ color: 'var(--status-error-color)' }} 
          />
        </div>
        <span className="text-xs mt-1" style={{ color: 'var(--status-error-color)' }}>
          Erro
        </span>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ 
            backgroundColor: 'var(--status-success-bg)',
            boxShadow: '0 4px 14px 0 var(--accent-color-transparent)'
          }}
        >
          <CheckCircle2 
            size={24} 
            className="transition-colors"
            style={{ color: 'var(--status-success-color)' }} 
          />
        </div>
        <span className="text-xs mt-1" style={{ color: 'var(--status-success-color)' }}>
          Finalizado
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--status-warning-bg)',
          boxShadow: '0 4px 14px 0 var(--accent-color-transparent)'
        }}
      >
        <Clock 
          size={24} 
          className="transition-colors"
          style={{ color: 'var(--status-warning-color)' }} 
        />
      </div>
      <span className="text-xs mt-1" style={{ color: 'var(--status-warning-color)' }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};
