import React from 'react';
import { Package, Plus, LayoutGrid, List } from 'lucide-react';

interface ProdutoHeaderProps {
  onAddClick: () => void;
  isAddingProduto: boolean;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const ProdutoHeader: React.FC<ProdutoHeaderProps> = ({
  onAddClick,
  isAddingProduto,
  viewType,
  onViewTypeChange,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-[var(--bg-primary)] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-[var(--accent-color)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Produtos
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
        onClick={onAddClick}
        disabled={isAddingProduto}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAddingProduto ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        ) : (
          <Plus size={20} />
        )}
        Adicionar Produto
      </button>
    </div>
  );
};

export { ProdutoHeader };
