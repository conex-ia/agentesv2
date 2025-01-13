import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrainingData } from './components/types/training';
import { useTrainingData } from '../../hooks/useTrainingData';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { Training } from './components/Training';
import { EmptyState } from '../../components/EmptyState';
import { GraduationCap } from 'lucide-react';

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { trainings, loading } = useTrainingData();
  const { bases, loading: basesLoading } = useKnowledgeBases();
  const [currentPage, setCurrentPage] = useState(1);
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

  if (loading || basesLoading) {
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
    <div className="flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treinamentos</h1>
        <button
          onClick={() => navigate('/training/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Novo Treinamento
        </button>
      </div>

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
    </div>
  );
};

export default TrainingPage;