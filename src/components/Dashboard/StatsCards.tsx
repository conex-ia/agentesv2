import React from 'react';
import { Bot, Wifi, WifiOff } from 'lucide-react';
import { useBotsStats } from '../../hooks/useBotsStats';
import StatsCard from './StatsCard';

const StatsCards = () => {
  const { stats, loading } = useBotsStats();

  const statsConfig = [
    {
      title: 'Total de Assistentes',
      value: loading ? '-' : stats.total,
      icon: Bot,
      color: 'bg-blue-500',
    },
    {
      title: 'Assistentes Online',
      value: loading ? '-' : stats.online,
      icon: Wifi,
      color: 'bg-emerald-500',
    },
    {
      title: 'Assistentes Offline',
      value: loading ? '-' : stats.offline,
      icon: WifiOff,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 place-items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCards;