import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: string | null;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  // Status Finalizado
  if (status === 'finalizado') {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#10b98130' }} // verde transparente
        >
          <CheckCircle2 
            size={24} 
            className="transition-colors"
            style={{ color: '#10b981' }} // verde
          />
        </div>
        <span className="text-xs mt-1" style={{ color: '#10b981' }}>
          Finalizado
        </span>
      </div>
    );
  }

  // Status Erro
  if (status?.includes('erro')) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#ef444425' }} // vermelho transparente
        >
          <AlertCircle 
            size={24} 
            className="transition-colors"
            style={{ color: '#ef4444' }} // vermelho
          />
        </div>
        <span className="text-xs mt-1" style={{ color: '#ef4444' }}>
          Erro
        </span>
      </div>
    );
  }

  // Status Aguardando (default para qualquer outro valor)
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: '#fbbf2420' }} // amarelo transparente
      >
        <Clock 
          size={24} 
          className="transition-colors"
          style={{ color: '#fbbf24' }} // amarelo
        />
      </div>
      <span className="text-xs mt-1" style={{ color: '#fbbf24' }}>
        Aguardando
      </span>
    </div>
  );
};
