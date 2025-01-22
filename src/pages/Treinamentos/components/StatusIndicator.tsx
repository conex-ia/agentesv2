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
          className="p-2 rounded-lg shadow-lg flex items-center justify-center bg-[#10b98130]"
        >
          <CheckCircle2 
            className="w-5 h-5 text-[#10b981]"
          />
        </div>
        <span className="text-xs mt-1 text-[#10b981]">
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
          className="p-2 rounded-lg shadow-lg flex items-center justify-center bg-[#ef444425]"
        >
          <AlertCircle 
            className="w-5 h-5 text-[#ef4444]"
          />
        </div>
        <span className="text-xs mt-1 text-[#ef4444]">
          Erro
        </span>
      </div>
    );
  }

  // Status Aguardando (default para qualquer outro valor)
  return (
    <div className="flex flex-col items-center">
      <div 
        className="p-2 rounded-lg shadow-lg flex items-center justify-center bg-[#fbbf2430]"
      >
        <Clock 
          className="w-5 h-5 text-[#fbbf24]"
        />
      </div>
      <span className="text-xs mt-1 text-[#fbbf24]">
        Aguardando
      </span>
    </div>
  );
};
