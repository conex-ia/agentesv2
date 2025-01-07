import React from 'react';
import { Bot, Wifi, WifiOff, Power } from 'lucide-react';
import { useBots } from '../../../hooks/useBots';

const StatsCards = () => {
  const { bots } = useBots();

  const totalBots = bots?.length || 0;
  const onlineBots = bots?.filter(bot => bot.bot_status === 'open').length || 0;
  const offlineBots = totalBots - onlineBots;
  const activeBots = bots?.filter(bot => bot.bot_ativo).length || 0;

  const cards = [
    {
      title: 'Total de Assistentes',
      value: totalBots,
      icon: Bot,
      iconColor: 'var(--info-color)'
    },
    {
      title: 'Assistentes Online',
      value: onlineBots,
      icon: Wifi,
      iconColor: 'var(--success-color)'
    },
    {
      title: 'Assistentes Offline',
      value: offlineBots,
      icon: WifiOff,
      iconColor: 'var(--error-color)'
    },
    {
      title: 'Assistentes Ativos',
      value: activeBots,
      icon: Power,
      iconColor: 'var(--accent-color)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-lg p-4 border backdrop-blur-sm flex items-center justify-between"
          style={{ 
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{card.title}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
          <div className="flex-shrink-0 p-3 rounded-lg ml-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <card.icon size={24} style={{ color: card.iconColor }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;