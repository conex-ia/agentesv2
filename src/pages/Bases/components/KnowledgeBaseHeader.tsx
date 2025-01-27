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
    <div className="flex justify-between items-center p-4 bg-[var(--bg-primary)] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[var(--accent-color)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Base(s) de Conhecimento
          </h2>
        </div>

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
      </div>

      <button
        onClick={onAddBase}
        disabled={isAddingBase}
        className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color-hover)] text-[var(--button-primary-text)] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
        Adicionar Base
      </button>
    </div>
  );
};

export { KnowledgeBaseHeader };
