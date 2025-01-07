import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Conversa } from '../../../../hooks/useConversas';

interface TiposChartProps {
  conversas: Conversa[];
}

interface ChartData {
  name: string;
  value: number;
}

const CORES = [
  'var(--accent-color)',
  'var(--success-color)',
  'var(--warning-color)',
  'var(--info-color)',
  'var(--error-color)',
];

const TiposChart: React.FC<TiposChartProps> = ({ conversas }) => {
  const data = useMemo(() => {
    const tiposPorMensagem = conversas.reduce((acc: { [key: string]: number }, conversa) => {
      const tipo = conversa.messageType || 'Desconhecido';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tiposPorMensagem)
      .map(([name, value]): ChartData => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }))
      .sort((a, b) => b.value - a.value);
  }, [conversas]);

  if (data.length === 0) {
    return (
      <div 
        className="h-64 flex items-center justify-center text-lg"
        style={{ color: 'var(--text-secondary)' }}
      >
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CORES[index % CORES.length]}
              strokeWidth={1}
              stroke="var(--bg-primary)"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          formatter={(value: number) => [`${value} mensagens`, '']}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value: string) => (
            <span style={{ color: 'var(--text-secondary)' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TiposChart; 