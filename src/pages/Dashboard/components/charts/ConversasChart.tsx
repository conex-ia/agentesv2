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

interface ConversasChartProps {
  conversas: Conversa[];
}

interface ChartData {
  numero: string;
  quantidade: number;
}

const ConversasChart: React.FC<ConversasChartProps> = ({ conversas }) => {
  const data = useMemo(() => {
    // Agrupar conversas por número
    const contagemPorNumero = conversas.reduce((acc: { [key: string]: number }, conversa) => {
      if (!conversa.remote_jid) return acc;
      
      // Extrair o número do remote_jid (formato: número@whatsapp.net)
      const numero = conversa.remote_jid.split('@')[0];
      acc[numero] = (acc[numero] || 0) + 1;
      return acc;
    }, {});

    // Converter para array e ordenar por quantidade
    return Object.entries(contagemPorNumero)
      .map(([numero, quantidade]): ChartData => ({
        numero: `+${numero}`,
        quantidade
      }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10); // Limitar aos 10 mais ativos
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
          top: 5,
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
          dataKey="numero"
          tick={{ fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
          width={90}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            borderRadius: '8px'
          }}
          labelStyle={{ color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          formatter={(value: number) => [`${value} mensagens`, '']}
          labelFormatter={(label) => `Cliente: ${label}`}
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

export default ConversasChart; 