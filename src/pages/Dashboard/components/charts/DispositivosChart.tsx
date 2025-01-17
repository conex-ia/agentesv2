import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Conversa } from '../../../../hooks/useConversas';

interface DispositivosChartProps {
  conversas: Conversa[];
}

const DispositivosChart: React.FC<DispositivosChartProps> = ({ conversas }) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
      
      // Atualiza as cores dos textos
      chart.options.scales.x.ticks.color = textColor;
      chart.options.scales.y.ticks.color = textColor;
      chart.update();
    }
  }, []);

  const contagem = {
    'WhatsApp Web': 0,
    'Android': 0,
    'iOS': 0,
    'Desconhecido': 0
  };

  conversas.forEach(conversa => {
    const device = conversa.dispositivo || 'Desconhecido';
    if (device in contagem) {
      contagem[device as keyof typeof contagem]++;
    } else {
      contagem.Desconhecido++;
    }
  });

  const data = {
    labels: Object.keys(contagem).map(key => `${key} (${contagem[key as keyof typeof contagem]})`),
    datasets: [
      {
        data: Object.values(contagem),
        backgroundColor: '#10b981',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.x} mensagens`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          padding: 12,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Bar 
        ref={chartRef}
        data={data} 
        options={options} 
        plugins={[{
          id: 'datalabels',
          afterDraw: (chart: any) => {
            const { ctx, data } = chart;
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
            ctx.save();
            
            data.datasets[0].data.forEach((value: number, i: number) => {
              const meta = chart.getDatasetMeta(0);
              const bar = meta.data[i];
              
              ctx.fillStyle = textColor;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold 12px sans-serif';
              
              const x = bar.x + 8;
              const y = bar.y;
              
              ctx.fillText(value.toString(), x, y);
            });
            
            ctx.restore();
          }
        }]} 
      />
    </div>
  );
};

export default DispositivosChart; 