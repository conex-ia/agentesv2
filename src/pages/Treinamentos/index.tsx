import React, { useState, useMemo, useCallback } from 'react';
import { useTrainingData } from '../../hooks/useTrainingData';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { ViewType } from './types';
import { KnowledgeBaseGrid } from '../Dashboard/components/KnowledgeBase/KnowledgeBaseGrid';
import { ModalAddBase } from '../Dashboard/components/KnowledgeBase/components/ModalAddBase';
import { TreinamentoHeader } from './components/TreinamentoHeader';
import TreinamentoGrid from './components/TreinamentoGrid';
import useAuth from '../../stores/useAuth';
import TrainingModal from './components/TrainingModal';
import ModalDeleteTreinamento from './components/ModalDeleteTreinamento';
import { TrainingData } from './types/training';
import { KnowledgeBaseHeader } from './components/KnowledgeBaseHeader';
import { EmptyState } from '../../components/EmptyState';
import { Database, FileText } from 'lucide-react';
import WelcomeHeader from '../Dashboard/components/WelcomeHeader';
import { useProject } from '../../contexts/ProjectContext';

const Treinamentos = () => {
  const { trainings, loading: trainingsLoading } = useTrainingData();
  const { bases, loading: basesLoading, error, deleteBase, addBase } = useKnowledgeBases();
  const { userUid, empresaUid } = useAuth();
  const { selectedProject } = useProject();
  const [isAddingBase, setIsAddingBase] = useState(false);
  const [isAddingTraining, setIsAddingTraining] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(() => {
    const savedViewType = localStorage.getItem('treinosViewType');
    return (savedViewType as ViewType) || 'table';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletingTraining, setIsDeletingTraining] = useState<string | null>(null);
  const [baseViewType, setBaseViewType] = useState<ViewType>(() => {
    const savedViewType = localStorage.getItem('basesViewType');
    return (savedViewType as ViewType) || 'table';
  });
  const [selectedTraining, setSelectedTraining] = useState<TrainingData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const loading = trainingsLoading || basesLoading;

  // Filtro dos dados baseado no projeto selecionado
  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];
    if (selectedProject === 'all') {
      return [...trainings]; // Criando uma nova referência do array
    }
    return trainings.filter(training => training.projeto === selectedProject);
  }, [trainings, selectedProject]);

  const filteredBases = useMemo(() => {
    if (!bases) return [];
    if (selectedProject === 'all') {
      return [...bases]; // Criando uma nova referência do array
    }
    return bases.filter(base => base.projeto === selectedProject);
  }, [bases, selectedProject]);

  const handleCloseAddBaseModal = () => {
    setIsAddingBase(false);
  };

  const handleCloseAddModal = () => {
    setIsTrainingModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTraining(null);
    setIsDeletingTraining(null);
  };

  const handleConfirmAddBase = async (name: string, projectId: string): Promise<string> => {
    try {
      const result = await addBase(name, projectId);
      setIsAddingBase(false);
      return result.uid || result.id || ''; // Retorna o ID da base criada
    } catch (error) {
      console.error('Erro ao adicionar base:', error);
      throw error;
    }
  };

  const handleAddTraining = async () => {
    if (isAddingTraining || !empresaUid || !userUid) return;
    
    setIsAddingTraining(true);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'adicionar',
          empresaUid,
          userUid
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar treinamento');
      }

      // Atualiza a lista de treinamentos
      // TODO: Implementar atualização da lista
    } catch (error) {
      console.error('Erro ao adicionar treinamento:', error);
    } finally {
      setIsAddingTraining(false);
    }
  };

  const handleOpenModal = useCallback((id: string, phase: string) => {
    const training = trainings.find(t => t.uid === id);
    if (training) {
      setSelectedTraining(training);
      setIsTrainingModalOpen(true);
    }
  }, [trainings]);

  const handleOpenDeleteModal = useCallback((training: TrainingData) => {
    setSelectedTraining(training);
    setIsDeleteModalOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedTraining) return { success: false, message: 'Treinamento não encontrado' };

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'excluir',
          baseUid: selectedTraining.uid,
          empresaUid,
          userUid
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir treinamento');
      }

      setSelectedTraining(null);
      setIsDeletingTraining(null);

      return { success: true, message: 'Treinamento excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir treinamento:', error);
      return { success: false, message: 'Erro ao excluir treinamento' };
    }
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    localStorage.setItem('treinosViewType', type);
  };

  const handleBaseViewTypeChange = (type: ViewType) => {
    setBaseViewType(type);
    localStorage.setItem('basesViewType', type);
  };

  if (loading) {
    return <div className="p-4 text-red-500">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro ao carregar bases: {error}</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader route="treinamentos" />
      <div className="w-full px-4 pb-4 pt-4 sm:pb-6">
        <div className="max-w-[1370px] mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <KnowledgeBaseHeader
                viewType={baseViewType}
                onViewTypeChange={handleBaseViewTypeChange}
                onAddBase={() => setIsAddingBase(true)}
              />
              <div className="mt-4">
                {filteredBases.length === 0 ? (
                  <div className="mt-4">
                    <EmptyState
                      icon={Database}
                      title="Nenhuma base de conhecimento"
                      description="Você ainda não possui nenhuma base de conhecimento. Crie uma nova base para começar."
                    />
                  </div>
                ) : (
                  <KnowledgeBaseGrid
                    bases={filteredBases}
                    viewType={baseViewType}
                    onDeleteBase={async (baseId) => {
                      const result = await deleteBase(baseId);
                      return { success: true, message: 'Base excluída com sucesso' };
                    }}
                    onAddBase={handleConfirmAddBase}
                  />
                )}
              </div>
            </div>

            <div>
              <TreinamentoHeader
                viewType={viewType}
                onViewTypeChange={handleViewTypeChange}
                onAddClick={handleAddTraining}
                isAddingTraining={isAddingTraining}
              />
              <div className="mt-4">
                {filteredTrainings.length === 0 ? (
                  <div className="mt-4">
                    <EmptyState
                      icon={FileText}
                      title="Nenhum treinamento"
                      description="Você ainda não possui nenhum treinamento. Adicione um novo conteúdo para começar."
                    />
                  </div>
                ) : (
                  <TreinamentoGrid
                    trainings={filteredTrainings}
                    viewType={viewType}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onOpenModal={handleOpenModal}
                    onOpenDeleteModal={handleOpenDeleteModal}
                    isDeletingTraining={isDeletingTraining}
                  />
                )}
              </div>
            </div>
          </div>

          {isAddingBase && (
            <ModalAddBase
              isOpen={isAddingBase}
              onClose={handleCloseAddBaseModal}
              onConfirm={handleConfirmAddBase}
            />
          )}

          {/* Modal de Gerenciar Treinamento */}
          <TrainingModal
            isOpen={isTrainingModalOpen}
            onClose={handleCloseAddModal}
            trainingId={selectedTraining?.uid}
            currentPhase={selectedTraining?.fase}
          />

          {/* Modal de Excluir Treinamento */}
          <ModalDeleteTreinamento
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            trainingName={selectedTraining?.resumo || 'Sem descrição'}
            trainingOrigin={selectedTraining?.origem || 'Não informada'}
            trainingBase={selectedTraining?.base || 'Aguardando'}
          />
        </div>
      </div>
    </div>
  );
};

export default Treinamentos;
