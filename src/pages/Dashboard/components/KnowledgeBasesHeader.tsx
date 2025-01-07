import React from 'react';
import { GraduationCap, LayoutGrid, List } from 'lucide-react';

interface KnowledgeBasesHeaderProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const KnowledgeBasesHeader: React.FC<KnowledgeBasesHeaderProps> = ({
  viewType,
  onViewTypeChange,
}) => {
  return (
    <div 
      className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 rounded-lg border backdrop-blur-sm"
      style={{ 
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--card-border)'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-color-transparent)' }}
        >
          <GraduationCap size={24} style={{ color: 'var(--accent-color)' }} />
        </div>
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Base(s) de Conhecimento
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewTypeChange('grid')}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: viewType === 'grid' ? 'var(--accent-color-transparent)' : 'transparent',
              color: viewType === 'grid' ? 'var(--accent-color)' : 'var(--text-secondary)',
              ':hover': {
                backgroundColor: viewType === 'grid' ? 'var(--accent-color-transparent)' : 'var(--bg-secondary)',
                color: viewType === 'grid' ? 'var(--accent-color)' : 'var(--text-primary)'
              }
            }}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => onViewTypeChange('table')}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: viewType === 'table' ? 'var(--accent-color-transparent)' : 'transparent',
              color: viewType === 'table' ? 'var(--accent-color)' : 'var(--text-secondary)',
              ':hover': {
                backgroundColor: viewType === 'table' ? 'var(--accent-color-transparent)' : 'var(--bg-secondary)',
                color: viewType === 'table' ? 'var(--accent-color)' : 'var(--text-primary)'
              }
            }}
          >
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasesHeader;
