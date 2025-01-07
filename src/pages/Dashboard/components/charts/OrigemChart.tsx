import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Conversa, ContagemPorOrigem } from '../../../../hooks/useConversas';

interface OrigemChartProps {
  conversas: Conversa[];
  contagem: ContagemPorOrigem;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const DADOS_ORIGEM = [
  { id: 'Assistente', color: 'var(--accent-color)' },
  { id: 'Humano', color: 'var(--warning-color)' }
] as const;

const OrigemChart: React.FC<OrigemChartProps> = ({ contagem }) => {
  const data = useMemo(() => {
    console.log('[OrigemChart] Usando contagem:', contagem);

    return [
      {
        name: 'Assistente',
        value: contagem.assistente,
        color: 'var(--accent-color)'
      },
      {
        name: 'Humano',
        value: contagem.humano,
        color: 'var(--warning-color)'
      }
    ];
  }, [contagem]);

  if (data.every(item => item.value === 0)) {
    return (
      <div 
        className="h-64 flex items-center justify-center text-lg"
        style={{ color: 'var(--text-secondary)' }}
      >
        Nenhum dado disponível
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
          startAngle={90}
          endAngle={450}
        >
          {data.map((entry) => (
            <Cell 
              key={entry.name}
              fill={entry.color}
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
          formatter={(value: number, name: string) => [
            `${value} mensagens (${((value / total) * 100).toFixed(1)}%)`,
            name
          ]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value: string, entry: any) => {
            const item = data.find(d => d.name === value);
            return (
              <span style={{ color: 'var(--text-secondary)' }}>
                {value} ({item?.value || 0})
              </span>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrigemChart; 