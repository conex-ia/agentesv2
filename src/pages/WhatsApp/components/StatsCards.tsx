import { Bot, Wifi, WifiOff, Power } from 'lucide-react';
import StatsCard from './StatsCard';

interface StatsCardsProps {
  total: number;
  online: number;
  offline: number;
  active: number;
}

export const StatsCards = ({ total, online, offline, active }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total de Assistentes"
        value={total}
        Icon={Bot}
      />
      <StatsCard
        title="Assistentes Online"
        value={online}
        Icon={Wifi}
      />
      <StatsCard
        title="Assistentes Offline"
        value={offline}
        Icon={WifiOff}
      />
      <StatsCard
        title="Assistentes Ativos"
        value={active}
        Icon={Power}
      />
    </div>
  );
}; 