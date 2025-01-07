import React from 'react';
import { useKnowledgeBases } from '../../../../hooks/useKnowledgeBases';
import { KnowledgeBaseGrid } from './KnowledgeBaseGrid';

interface KnowledgeBasePageProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ 
  viewType, 
  onViewTypeChange 
}) => {
  const { bases, loading, error, isDeletingBase, deleteBase, addBase } = useKnowledgeBases();

  console.log('KnowledgeBasePage renderizado:', { bases, loading, error });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Erro ao carregar bases: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <KnowledgeBaseGrid
        bases={bases}
        viewType={viewType}
        onViewTypeChange={onViewTypeChange}
        isDeletingBase={isDeletingBase}
        onDeleteBase={deleteBase}
        onAddBase={addBase}
      />
    </div>
  );
};

export default KnowledgeBasePage;
