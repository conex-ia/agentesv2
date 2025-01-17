import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type IconProps = {
  size?: number;
  style?: React.CSSProperties;
};

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <div className="w-full px-4">
      <div className="max-w-[1370px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-6 shadow-lg text-center border"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)'
          }}
        >
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: 'var(--accent-color-transparent)' }}
          >
            <Icon size={32} style={{ color: 'var(--accent-color)' }} />
          </div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
