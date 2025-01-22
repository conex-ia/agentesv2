import React from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';

interface ProjetosHeaderProps {
  viewType: 'grid' | 'table';
  setViewType: (type: 'grid' | 'table') => void;
  onAddClick: () => void;
}

const ProjetosHeader: React.FC<ProjetosHeaderProps> = ({
  viewType,
  setViewType,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Projetos
        </h2>
        <div 
          className="flex items-center gap-2 p-1 rounded-lg" 
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <button
            onClick={() => setViewType('table')}
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
            onClick={() => setViewType('grid')}
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
        onClick={onAddClick}
        className="px-4 py-2 rounded-lg flex items-center gap-2 text-white bg-emerald-600/90 hover:bg-emerald-700/90 transition-colors"
      >
        <Plus size={20} />
        <span>Novo Projeto</span>
      </button>
    </div>
  );
};

export default ProjetosHeader;
