import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Bot, Wifi, WifiOff, Power } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
}

// Mapa de cores para cada ícone com cores mais consistentes
const iconColorMap = {
  [Bot.name]: 'var(--accent-color)',
  [Wifi.name]: 'var(--success-color)',
  [WifiOff.name]: 'var(--error-color)',
  [Power.name]: 'var(--warning-color)'
};

const StatsCard = ({ title, value, Icon }: StatsCardProps) => {
  const iconColor = iconColorMap[Icon.name] || 'var(--accent-color)';
  
  return (
    <div 
      className="rounded-lg p-6 hover:-translate-y-1"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-elevation-medium)',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLDivElement).style.boxShadow = 'var(--shadow-elevation-high)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLDivElement).style.boxShadow = 'var(--shadow-elevation-medium)';
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
            {title}
          </span>
          <span style={{ color: 'var(--text-primary)' }} className="text-2xl font-semibold">
            {value}
          </span>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: `${iconColor}15`,
            border: `1px solid ${iconColor}30`
          }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 