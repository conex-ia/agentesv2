import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, LayoutGrid, List } from 'lucide-react';

interface ProjetosHeaderProps {
  onAddProjeto: () => void;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const ProjetosHeader: React.FC<ProjetosHeaderProps> = ({ 
  onAddProjeto, 
  viewType, 
  onViewTypeChange 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: 'var(--icon-bg)',
              boxShadow: 'var(--icon-shadow)'
            }}
          >
            <FolderOpen className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Projetos
            </h1>
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
        </div>
        <button
          onClick={onAddProjeto}
          className="w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          style={{ 
            backgroundColor: 'var(--accent-color)',
            color: 'var(--button-primary-text)'
          }}
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Adicionar Projeto</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProjetosHeader;
