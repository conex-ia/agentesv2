import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Conversa } from '../../../../hooks/useConversas';

interface DispositivosChartProps {
  conversas: Conversa[];
}

interface ChartData {
  dispositivo: string;
  quantidade: number;
  color: string;
}

const CORES = {
  'WhatsApp Web': '#4DDAB6',
  'WhatsApp': '#1FA016',
  'iOS': 'var(--info-color)',
  'Android': 'var(--warning-color)',
  'Typebot': 'var(--error-color)',
  'Desconhecido': 'var(--text-secondary)'
};

const formatarDispositivo = (dispositivo: string | null): string => {
  if (!dispositivo) return 'Desconhecido';
  
  // Log para debug
  console.log('[formatarDispositivo] Valor original:', dispositivo);
  
  const valor = dispositivo.toLowerCase().trim();
  
  // Log para debug
  console.log('[formatarDispositivo] Valor normalizado:', valor);
  
  switch (valor) {
    case 'whatsapp web':
    case 'web':
      return 'WhatsApp Web';
    case 'whatsapp':
      return 'WhatsApp';
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'typebot':
      return 'Typebot';
    case 'whatsapp unknown':
    case 'unknown':
      return 'Desconhecido';
    default:
      console.log('[formatarDispositivo] Valor não mapeado:', valor);
      return 'Desconhecido';
  }
};

const DispositivosChart: React.FC<DispositivosChartProps> = ({ conversas }) => {
  const data = useMemo(() => {
    // Contagem direta por tipo de dispositivo
    const totais = {
      'WhatsApp Web': 0,
      'WhatsApp': 0,
      'iOS': 0,
      'Android': 0,
      'Typebot': 0,
      'Desconhecido': 0
    };

    // Contagem única por SQL/DB
    const contagem = conversas.reduce((acc, conversa) => {
      const tipo = conversa.dispositivo?.toLowerCase().trim() || '';
      
      if (tipo.includes('web')) acc['WhatsApp Web']++;
      else if (tipo === 'whatsapp') acc['WhatsApp']++;
      else if (tipo === 'ios') acc['iOS']++;
      else if (tipo === 'android') acc['Android']++;
      else if (tipo === 'typebot') acc['Typebot']++;
      else acc['Desconhecido']++;
      
      return acc;
    }, totais);

    // Converter para o formato do gráfico e não limitar os dados
    return Object.entries(contagem)
      .filter(([_, quantidade]) => quantidade > 0)
      .map(([dispositivo, quantidade]): ChartData => ({
        dispositivo,
        quantidade,
        color: CORES[dispositivo as keyof typeof CORES]
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

  const total = data.reduce((sum, item) => sum + item.quantidade, 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 40,
          left: 20,
          bottom: 30,
        }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false}
          stroke="var(--border-color)"
        />
        <XAxis
          dataKey="dispositivo"
          tick={{ fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
          angle={-45}
          textAnchor="end"
          height={60}
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
          formatter={(value: number) => [
            `${value} mensagens (${((value / total) * 100).toFixed(1)}%)`,
            ''
          ]}
        />
        <Bar dataKey="quantidade" radius={[4, 4, 0, 0]} strokeWidth={0}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              strokeWidth={0}
            />
          ))}
          <LabelList
            dataKey="quantidade"
            position="top"
            style={{ fill: 'var(--text-secondary)' }}
            formatter={(value: number) => `${value} (${((value / total) * 100).toFixed(1)}%)`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DispositivosChart; 