import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewType, onViewTypeChange }) => {
  return (
    <div 
      className="flex items-center gap-2 p-1 rounded-lg" 
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <button
        onClick={() => onViewTypeChange('table')}
        className="p-2 rounded-lg transition-all"
        style={{ 
          backgroundColor: viewType === 'table' ? 'var(--bg-primary)' : 'transparent',
          color: viewType === 'table' ? 'var(--accent-color)' : 'var(--text-secondary)',
          boxShadow: viewType === 'table' ? 'var(--shadow-elevation-low)' : 'none',
          border: viewType === 'table' ? '1px solid var(--border-color)' : 'none'
        }}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => onViewTypeChange('grid')}
        className="p-2 rounded-lg transition-all"
        style={{ 
          backgroundColor: viewType === 'grid' ? 'var(--bg-primary)' : 'transparent',
          color: viewType === 'grid' ? 'var(--accent-color)' : 'var(--text-secondary)',
          boxShadow: viewType === 'grid' ? 'var(--shadow-elevation-low)' : 'none',
          border: viewType === 'grid' ? '1px solid var(--border-color)' : 'none'
        }}
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
};
