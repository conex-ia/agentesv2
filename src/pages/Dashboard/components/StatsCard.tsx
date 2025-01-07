import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  index: number;
}

const StatsCard = ({ title, value, icon: Icon, color, index }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg p-6 shadow-lg w-full"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        boxShadow: '0 2px 4px var(--table-shadow)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm truncate"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-3xl font-bold mt-1 truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {value}
            </motion.p>
          </AnimatePresence>
        </div>
        <div 
          className="p-3 rounded-lg flex-shrink-0 ml-4"
          style={{ 
            backgroundColor: 'var(--icon-bg)',
            boxShadow: '0 2px 4px var(--icon-shadow)'
          }}
        >
          <Icon size={24} style={{ color: 'var(--text-primary)' }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;