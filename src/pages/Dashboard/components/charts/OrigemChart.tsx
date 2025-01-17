import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin
} from 'chart.js';
import { ContagemPorOrigem } from '../../../../hooks/useConversas';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrigemChartProps {
  contagem: ContagemPorOrigem;
}

const OrigemChart: React.FC<OrigemChartProps> = ({ contagem }) => {
  const total = contagem.assistente + contagem.humano;

  const customLegend: Plugin<'doughnut'> = {
    id: 'customLegend',
    afterDraw: (chart) => {
      const { ctx, data, chartArea } = chart;
      const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-secondary')
        .trim();

      ctx.save();

      // Configurações da legenda
      const legendItems = data.labels?.map((label, i) => {
        const dataset = data.datasets[0];
        const value = dataset.data[i] as number;
        const percentage = ((value / total) * 100).toFixed(1);
        const color = dataset.backgroundColor?.[i] as string;
        return { label, value, percentage, color };
      }) || [];

      // Posicionamento inicial
      const padding = 20;
      const itemWidth = 200; // Largura de cada item da legenda
      const startY = chartArea.bottom + 30;
      const dotRadius = 4;
      const centerX = chart.width / 2;
      const startX = centerX - (itemWidth + padding); // Começa à esquerda do centro

      // Estilo do texto
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '500 14px Inter, system-ui, sans-serif';
      ctx.fillStyle = textColor;

      // Renderiza os itens da legenda lado a lado
      legendItems.forEach((item, i) => {
        const x = startX + (i * (itemWidth + padding));

        // Círculo colorido
        ctx.beginPath();
        ctx.arc(x, startY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        // Texto
        ctx.fillStyle = textColor;
        ctx.fillText(
          `${item.label} (${item.value} - ${item.percentage}%)`,
          x + dotRadius * 3,
          startY
        );
      });

      ctx.restore();
    }
  };

  const data: ChartData<'doughnut'> = {
    labels: ['Assistente', 'Humano'],
    datasets: [
      {
        data: [contagem.assistente, contagem.humano],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 0,
        bottom: 80,
        left: 20,
        right: 20
      }
    },
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: {
          size: 14
        },
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const label = context.label?.split(' (')[0];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} mensagens (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <Doughnut 
          data={data} 
          options={options} 
          plugins={[customLegend]}
        />
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-primary)',
            fontSize: '24px',
            fontWeight: 'bold',
            lineHeight: '1.2',
          }}
        >
          {total}
          <div style={{ fontSize: '14px', marginTop: '2px' }}>mensagens</div>
        </div>
      </div>
    </div>
  );
};

export default OrigemChart;
