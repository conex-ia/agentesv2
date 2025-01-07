import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Wifi, WifiOff } from 'lucide-react';
import { useBotsStats } from '../../../hooks/useBotsStats';

const StatsCards = () => {
  const { stats, loading } = useBotsStats();

  const statsConfig = [
    {
      title: 'Total de Assistentes',
      value: loading ? '-' : stats?.total ?? 0,
      icon: Bot,
      color: 'bg-blue-500',
    },
    {
      title: 'Assistentes Online',
      value: loading ? '-' : stats?.online ?? 0,
      icon: Wifi,
      color: 'bg-emerald-500',
    },
    {
      title: 'Assistentes Offline',
      value: loading ? '-' : stats?.offline ?? 0,
      icon: WifiOff,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${stat.value}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-3xl font-bold text-white mt-1"
                >
                  {stat.value}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;