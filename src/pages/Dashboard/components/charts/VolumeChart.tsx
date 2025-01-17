import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Conversa } from '../../../../hooks/useConversas';

interface VolumeChartProps {
  conversas: Conversa[];
}

const VolumeChart: React.FC<VolumeChartProps> = ({ conversas }) => {
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

  // Agrupa conversas por data
  const contagemPorData = conversas.reduce((acc: { [key: string]: number }, conversa) => {
    const data = new Date(conversa.created_at).toLocaleDateString();
    acc[data] = (acc[data] || 0) + 1;
    return acc;
  }, {});

  // Ordena as datas
  const datasOrdenadas = Object.keys(contagemPorData).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const data = {
    labels: datasOrdenadas,
    datasets: [
      {
        data: datasOrdenadas.map(data => contagemPorData[data]),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30 // Aumenta o padding superior para evitar corte dos valores
      }
    },
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
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 14,
          weight: 'bold' as const
        },
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} mensagens`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          padding: 8,
          stepSize: 1,
          font: {
            size: 12
          }
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line 
        ref={chartRef}
        data={data} 
        options={options} 
        plugins={[{
          id: 'datalabels',
          afterDatasetsDraw: (chart: any) => {
            const { ctx, data } = chart;
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
            ctx.save();
            
            data.datasets[0].data.forEach((value: number, i: number) => {
              const meta = chart.getDatasetMeta(0);
              const point = meta.data[i];
              
              ctx.fillStyle = textColor;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.font = 'bold 12px sans-serif';
              
              const x = point.x;
              const y = point.y - 10; // 10px acima do ponto
              
              ctx.fillText(value.toString(), x, y);
            });
            
            ctx.restore();
          }
        }]} 
      />
    </div>
  );
};

export default VolumeChart; 