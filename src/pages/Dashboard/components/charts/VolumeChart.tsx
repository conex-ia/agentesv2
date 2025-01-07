import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Conversa } from '../../../../hooks/useConversas';

interface VolumeChartProps {
  conversas: Conversa[];
}

interface ChartData {
  date: string;
  quantidade: number;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ conversas }) => {
  const data = useMemo(() => {
    const volumePorDia = conversas.reduce((acc: { [key: string]: number }, conversa) => {
      const data = new Date(conversa.messageTimestamp || conversa.created_at);
      const dataFormatada = data.toLocaleDateString('pt-BR');
      
      acc[dataFormatada] = (acc[dataFormatada] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(volumePorDia)
      .map(([date, quantidade]): ChartData => ({
        date,
        quantidade
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 20,
        }}
      >
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false}
          stroke="var(--border-color)"
        />
        <XAxis 
          dataKey="date" 
          tick={{ fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
        />
        <YAxis 
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
        />
        <Area
          type="monotone"
          dataKey="quantidade"
          stroke="var(--accent-color)"
          fillOpacity={1}
          fill="url(#volumeGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default VolumeChart; 