import React, { useState } from 'react';
import { Training } from './components/Training';
import type { TrainingData } from './components/Training';
import { useTrainingData } from '../../hooks/useTrainingData';
import { EmptyState } from '../../components/EmptyState';
import { GraduationCap } from 'lucide-react';

const TrainingPage = () => {
  const { trainings, loading } = useTrainingData();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<'grid' | 'table'>('grid');
  const [isDeletingTraining, setIsDeletingTraining] = useState<string | null>(null);

  const handleOpenModal = (id: string, phase: string) => {
    // Implementar lógica de abrir modal
    console.log('Open modal:', { id, phase });
  };

  const handleOpenDeleteModal = (training: TrainingData) => {
    // Implementar lógica de deletar
    console.log('Delete training:', training);
    setIsDeletingTraining(training.uid);
  };

  if (loading) {
    return (
      <div className="w-full px-4">
        <div className="max-w-[1370px] mx-auto">
          <div 
            className="backdrop-blur-sm rounded-lg p-8 border"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="text-center" style={{ color: 'var(--text-secondary)' }}>Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!trainings || trainings.length === 0) {
    return (
      <div className="w-full px-4">
        <div className="max-w-[1370px] mx-auto">
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" style={{ color: 'var(--accent-color)' }} />}
            title="Nenhum conteúdo de treinamento"
            description="Você ainda não possui nenhum conteúdo de treinamento. Adicione um novo conteúdo para começar."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 pt-4">
      <div className="max-w-[1370px] mx-auto">
        <Training
          trainings={trainings}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onOpenModal={handleOpenModal}
          onOpenDeleteModal={handleOpenDeleteModal}
          isDeletingTraining={isDeletingTraining}
          viewMode={viewType}
        />
      </div>
    </div>
  );
};

export default TrainingPage; 