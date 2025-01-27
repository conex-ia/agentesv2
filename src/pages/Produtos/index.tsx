import React, { useState, useMemo } from 'react';
import { useTrainingData } from '../../hooks/useTrainingData';
import { ViewType } from '../Treinamentos/types';
import { ProdutoHeader } from './components/ProdutoHeader';
import ProdutoGrid from './components/ProdutoGrid';
import useAuth from '../../stores/useAuth';
import { TrainingData } from '../Treinamentos/types/training';
import { EmptyState } from '../../components/EmptyState';
import { Package } from 'lucide-react';
import WelcomeHeader from '../../components/WelcomeHeader';
import { useProject } from '../../contexts/ProjectContext';
import { useProjetosSelect } from '../../hooks/useProjetosSelect';
import ModalAddProduto from './components/ModalAddProduto';

const Produtos: React.FC = () => {
  const { trainings, loading: trainingsLoading } = useTrainingData();
  const { userUid, empresaUid } = useAuth();
  const { selectedProject } = useProject();
  const { projetos, loading: loadingProjetos } = useProjetosSelect(empresaUid);
  const [isAddingProduto, setIsAddingProduto] = useState(false);
  const [viewType, setViewType] = useState<ViewType>(() => {
    const savedViewType = localStorage.getItem('produtosViewType');
    return (savedViewType as ViewType) || 'table';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletingTraining, setIsDeletingTraining] = useState<string | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<TrainingData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdutoId, setNewProdutoId] = useState<string | null>(null);

  const loading = trainingsLoading || loadingProjetos;

  // Filtro dos dados baseado no projeto selecionado e rota = 'produtos'
  const filteredTrainings = useMemo(() => {
    if (!trainings) return [];
    return trainings.filter(training => {
      const projectMatch = selectedProject === 'all' || training.projeto === selectedProject;
      const rotaMatch = training.rota === 'produtos';
      return projectMatch && rotaMatch;
    });
  }, [trainings, selectedProject]);

  const handleAddProduto = async () => {
    if (isAddingProduto || !empresaUid || !userUid) return;
    
    setIsAddingProduto(true);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'adicionar',
          empresaUid,
          userUid,
          rota: 'produtos'
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar produto');
      }

      const data = await response.json();
      if (data.uid) {
        setNewProdutoId(data.uid);
        setShowAddModal(true);
      }

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    } finally {
      setIsAddingProduto(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewProdutoId(null);
  };

  const handleOpenModal = (id: string, fase: string) => {
    console.log('Abrindo modal para produto:', { id, fase });
    const training = trainings.find(t => t.uid === id);
    if (training) {
      console.log('Training encontrado:', training);
      setSelectedTraining(training);
    } else {
      console.log('Training não encontrado, usando fase padrão:', fase);
      setSelectedTraining({ uid: id, fase } as TrainingData);
    }
    setNewProdutoId(id);
    setShowAddModal(true);
  };

  const handleOpenDeleteModal = (training: TrainingData) => {
    setSelectedTraining(training);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    localStorage.setItem('produtosViewType', type);
  };

  if (loading) {
    return <div className="p-4 text-red-500">Carregando...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader route="produtos" />
      <div className="w-full px-4 pb-4 pt-4 sm:pb-6">
        <div className="max-w-[1370px] mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <ProdutoHeader
                viewType={viewType}
                onViewTypeChange={handleViewTypeChange}
                onAddClick={handleAddProduto}
                isAddingProduto={isAddingProduto}
              />
            </div>

            {filteredTrainings.length === 0 ? (
              <EmptyState
                icon={<Package size={48} />}
                title="Nenhum produto encontrado"
                description="Comece adicionando um novo produto"
              />
            ) : (
              <ProdutoGrid
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

      <ModalAddProduto
        isOpen={showAddModal}
        onClose={handleCloseModal}
        produtoId={newProdutoId || undefined}
        currentPhase={selectedTraining?.fase || 'aguardando'}
      />
    </div>
  );
};

export default Produtos;
