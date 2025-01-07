import React from 'react';
import { LayoutGrid, List, Plus, GraduationCap } from 'lucide-react';

interface KnowledgeBaseHeaderProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
  onAddBase: () => void;
  isAddingBase: boolean;
}

const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  viewType,
  onViewTypeChange,
  onAddBase,
  isAddingBase
}) => {
  return (
    <div 
      className="flex justify-between items-center p-4 rounded-lg border backdrop-blur-sm"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        color: 'var(--text-primary)'
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
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onViewTypeChange('grid')}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: viewType === 'grid' ? 'var(--accent-color-transparent)' : 'transparent',
              color: viewType === 'grid' ? 'var(--accent-color)' : 'var(--text-secondary)'
            }}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => onViewTypeChange('table')}
            className="p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: viewType === 'table' ? 'var(--accent-color-transparent)' : 'transparent',
              color: viewType === 'table' ? 'var(--accent-color)' : 'var(--text-secondary)'
            }}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <button
        onClick={onAddBase}
        disabled={isAddingBase}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          backgroundColor: 'var(--accent-color)',
          color: 'var(--white)'
        }}
      >
        <Plus size={20} />
        {isAddingBase ? 'Adicionando...' : 'Adicionar Base'}
      </button>
    </div>
  );
};

export { KnowledgeBaseHeader };
