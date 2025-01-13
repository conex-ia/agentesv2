import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Conversa } from '../../../../hooks/useConversas';

interface DispositivosChartProps {
  conversas: Conversa[];
}

interface DispositivoData {
  nome: string;
  quantidade: number;
  percentual: string;
}

const DispositivosChart: React.FC<DispositivosChartProps> = ({ conversas }) => {
  const data = useMemo(() => {
    const contagem = conversas.reduce((acc: { [key: string]: number }, conversa) => {
      const dispositivo = conversa.dispositivo || 'Desconhecido';
      acc[dispositivo] = (acc[dispositivo] || 0) + 1;
      return acc;
    }, {});

    const total = conversas.length;

    return Object.entries(contagem)
      .map(([nome, quantidade]): DispositivoData => ({
        nome,
        quantidade,
        percentual: `${((quantidade / total) * 100).toFixed(1)}%`
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
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
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 30,
          left: 100,
          bottom: 5,
        }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          horizontal={false}
          stroke="var(--border-color)"
        />
        <XAxis
          type="number"
          tick={{ fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
        />
        <YAxis
          type="category"
          dataKey="nome"
          tick={{ fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          formatter={(value: number, name: string, props: any) => [
            `${value} (${props.payload.percentual})`,
            'Mensagens'
          ]}
        />
        <Bar
          dataKey="quantidade"
          fill="var(--accent-color)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DispositivosChart; 