import React from 'react';
import { useConversas } from '../../../hooks/useConversas';
import VolumeChart from './charts/VolumeChart';
import OrigemChart from './charts/OrigemChart';
import ConversasChart from './charts/ConversasChart';
import DispositivosChart from './charts/DispositivosChart';

const DashboardCharts: React.FC = () => {
  const { conversas, contagem, loading, error } = useConversas();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className="animate-pulse rounded-lg p-4 border backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--sidebar-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div 
              className="h-64 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="p-4 rounded-lg text-center"
        style={{ color: 'var(--error-color)' }}
      >
        Erro ao carregar dados dos gráficos
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gráfico 1 - Volume Temporal */}
      <div 
        className="rounded-lg p-4 border backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Volume de Mensagens
        </h3>
        <VolumeChart conversas={conversas} />
      </div>

      {/* Gráfico 2 - Distribuição por Origem */}
      <div 
        className="rounded-lg p-4 border backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Origem das Mensagens
        </h3>
        <OrigemChart conversas={conversas} contagem={contagem} />
      </div>

      {/* Gráfico 3 - Distribuição por Cliente */}
      <div 
        className="rounded-lg p-4 border backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Top 10 Clientes por Volume
        </h3>
        <ConversasChart conversas={conversas} />
      </div>

      {/* Gráfico 4 - Distribuição por Dispositivo */}
      <div 
        className="rounded-lg p-4 border backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Distribuição por Dispositivo
        </h3>
        <DispositivosChart conversas={conversas} />
      </div>
    </div>
  );
};

export default DashboardCharts; 