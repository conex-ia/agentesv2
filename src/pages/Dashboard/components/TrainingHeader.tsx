import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, LayoutGrid, Table } from 'lucide-react';

interface TrainingHeaderProps {
  onAddBase: () => void;
  isAddingTraining: boolean;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
  knowledgeBaseViewType: 'grid' | 'table';
  onKnowledgeBaseViewTypeChange: (type: 'grid' | 'table') => void;
}

const TrainingHeader: React.FC<TrainingHeaderProps> = ({
  onAddBase,
  isAddingTraining,
  viewType,
  onViewTypeChange,
  knowledgeBaseViewType,
  onKnowledgeBaseViewTypeChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        border: '1px solid var(--card-border)'
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-color-transparent)' }}
          >
            <GraduationCap size={24} className="sm:w-8 sm:h-8" style={{ color: 'var(--accent-color)' }} />
          </div>
          <div className="flex items-center gap-4">
            <h1 
              className="text-lg sm:text-xl md:text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              Base(s) de Conhecimento
            </h1>
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-1 rounded-lg p-1"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <button
                  onClick={() => onKnowledgeBaseViewTypeChange('table')}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: knowledgeBaseViewType === 'table' ? 'var(--accent-color-transparent)' : 'transparent',
                    color: knowledgeBaseViewType === 'table' ? 'var(--accent-color)' : 'var(--text-secondary)'
                  }}
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onKnowledgeBaseViewTypeChange('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: knowledgeBaseViewType === 'grid' ? 'var(--accent-color-transparent)' : 'transparent',
                    color: knowledgeBaseViewType === 'grid' ? 'var(--accent-color)' : 'var(--text-secondary)'
                  }}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onAddBase}
          disabled={isAddingTraining}
          className="w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: 'var(--accent-color)',
            color: 'var(--white)',
            ':hover': { backgroundColor: 'var(--accent-hover)' }
          }}
        >
          <Plus className="sm:w-5 sm:h-5" />
          <span>{isAddingTraining ? 'Adicionando...' : 'Adicionar Base'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default TrainingHeader;
