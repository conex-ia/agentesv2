import React from 'react';
import { useConversas } from '../../hooks/useConversas';
import VolumeChart from './components/charts/VolumeChart';
import DispositivosChart from './components/charts/DispositivosChart';
import OrigemChart from './components/charts/OrigemChart';
import WelcomeHeader from './components/WelcomeHeader';

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
    <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
      {title}
    </h2>
    <div style={{ color: 'var(--text-primary)' }}>
      {children}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { conversas, contagem, loading, error } = useConversas();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader />
      
      <div className="w-full px-6 pb-6">
        <div className="max-w-[1370px] mx-auto">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse rounded-lg p-4" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
                  <div className="h-64 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', opacity: 0.5 }}></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--error-color)' }}>
              Erro ao carregar dados dos gráficos: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartContainer title="Volume de Mensagens">
                <VolumeChart conversas={conversas} />
              </ChartContainer>

              <ChartContainer title="Origem das Mensagens">
                <OrigemChart contagem={contagem} />
              </ChartContainer>

              <ChartContainer title="Distribuição por Dispositivo">
                <DispositivosChart conversas={conversas} />
              </ChartContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
