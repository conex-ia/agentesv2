import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ContagemPorOrigem } from '../../../../hooks/useConversas';

interface OrigemChartProps {
  contagem: ContagemPorOrigem;
}

const COLORS = {
  assistente: 'var(--accent-color)',
  humano: 'var(--warning-color)'
};

const OrigemChart: React.FC<OrigemChartProps> = ({ contagem }) => {
  const data = [
    { name: 'Assistente', value: contagem.assistente },
    { name: 'Humano', value: contagem.humano }
  ];

  const total = contagem.assistente + contagem.humano;

  if (total === 0) {
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
              fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
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
          formatter={(value: number) => [
            `${value} (${((value / total) * 100).toFixed(1)}%)`,
            'Mensagens'
          ]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value: string) => (
            <span style={{ color: 'var(--text-primary)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrigemChart; 