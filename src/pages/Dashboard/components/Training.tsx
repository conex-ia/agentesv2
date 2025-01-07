import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrainingData } from '../../../hooks/useTrainingData';
import type { TrainingData } from './Training/types';
import type { TrainingGridProps } from './TrainingGrid';
import useAuth from '../../../stores/useAuth';
import TrainingModal from './TrainingModal';
import TrainingHeader from './TrainingHeader';
import ContentHeader from './ContentHeader';
import TrainingGrid from './TrainingGrid';
import { KnowledgeBasePage } from './KnowledgeBase/KnowledgeBasePage';
import ModalDeleteTreinamento from './Training/components/ModalDeleteTreinamento';
import { ModalAddBase } from './KnowledgeBase/components/ModalAddBase';

interface TrainingProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const Training: React.FC<TrainingProps> = ({ viewType, onViewTypeChange }) => {
  const { trainings, loading: trainingsLoading } = useTrainingData();
  const { userUid, empresaUid } = useAuth();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addBaseModal, setAddBaseModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<{ id: string, phase: string } | null>(null);
  
  // Loading states
  const [isAddingBase, setIsAddingBase] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isDeletingTraining, setIsDeletingTraining] = useState<string | null>(null);
  
  // Pagination states
  const [currentTrainingPage, setCurrentTrainingPage] = useState(1);
  const [currentBasePage, setCurrentBasePage] = useState(1);
  const [knowledgeBaseViewType, setKnowledgeBaseViewType] = useState<'grid' | 'table'>(() => {
    const savedViewType = localStorage.getItem('knowledgeBaseViewType');
    return (savedViewType as 'grid' | 'table') || 'grid';
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTrainingForDelete, setSelectedTrainingForDelete] = useState<TrainingData | null>(null);

  // Handlers for base management
  const handleAddBase = () => {
    setAddBaseModal(true);
  };

  const handleConfirmAddBase = async (name: string, projectUid: string) => {
    if (!empresaUid || !userUid) return 'Erro: Usuário não autenticado';
    setIsAddingBase(true);

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'criarTabela',
          empresaUid,
          userUid,
          nome: name,
          projetoUid: projectUid
        }),
      });

      const data = await response.json();
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      if (data.status === 'success' || data.message === 'Workflow was started') {
        setAddBaseModal(false);
        return 'Workflow started';
      } else {
        throw new Error(`Failed to create base: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating base:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      setIsAddingBase(false);
    }
  };

  // Handlers for content management
  const handleAddContent = async () => {
    if (isAddingContent || !empresaUid || !userUid) return;
    
    setIsAddingContent(true);
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

      const data = await response.json();
      
      if (data.status === 'success' && data.baseUid) {
        handleOpenModal(data.baseUid, 'aguardando');
      }
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setIsAddingContent(false);
    }
  };

  // Modal handlers
  const handleOpenModal = (id: string, phase: string) => {
    setSelectedTraining({ id, phase });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
  };

  const handleOpenDeleteModal = (training: TrainingData) => {
    if (!training || !training.uid) {
      console.error('[ERROR] Training inválido recebido:', training);
      return;
    }

    console.log('[DEBUG] Training selecionado para exclusão:', {
      uid: training.uid,
      base: training.base,
      resumo: training.resumo,
      origem: training.origem
    });

    setSelectedTrainingForDelete(training);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTrainingForDelete || !empresaUid || !userUid) {
      return { success: false, message: 'Nenhum treinamento selecionado' };
    }
    
    setIsDeletingTraining(selectedTrainingForDelete.uid);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'excluir',
          empresaUid,
          userUid,
          baseUid: selectedTrainingForDelete.uid
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success' || data.message === 'Workflow was started') {
        return { success: true, message: 'Treinamento excluído com sucesso' };
      } else {
        throw new Error(data.message || 'Erro ao excluir treinamento');
      }
    } catch (error) {
      console.error('Error deleting training:', error);
      return { success: false, message: 'Erro ao excluir treinamento' };
    } finally {
      setIsDeletingTraining(null);
    }
  };

  if (trainingsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 pt-6"
      >
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
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 pt-6 pb-8"
      >
        <div className="max-w-[1370px] mx-auto">
          {/* Seção Base de Conhecimento */}
          <div>
            <div className="mb-6">
              <TrainingHeader 
                onAddBase={handleAddBase}
                isAddingTraining={isAddingContent}
                viewType={viewType}
                onViewTypeChange={onViewTypeChange}
                knowledgeBaseViewType={knowledgeBaseViewType}
                onKnowledgeBaseViewTypeChange={setKnowledgeBaseViewType}
              />
            </div>

            <KnowledgeBasePage
              viewType={knowledgeBaseViewType}
              onViewTypeChange={setKnowledgeBaseViewType}
            />
          </div>
          
          {/* Seção Treinamento */}
          <div className="mt-12 mb-4">
            <div className="mb-6">
              <ContentHeader 
                onAddContent={handleAddContent}
                isAddingContent={isAddingContent}
                viewType={viewType}
                onViewTypeChange={onViewTypeChange}
              />
            </div>

            <TrainingGrid 
              trainings={trainings}
              currentPage={currentTrainingPage}
              onPageChange={setCurrentTrainingPage}
              onOpenModal={handleOpenModal}
              onOpenDeleteModal={handleOpenDeleteModal}
              isDeletingTraining={isDeletingTraining}
              viewType={viewType}
            />
          </div>
        </div>
      </motion.div>

      <TrainingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        trainingId={selectedTraining?.id}
        currentPhase={selectedTraining?.phase}
      />

      {deleteModalOpen && selectedTrainingForDelete && (
        <ModalDeleteTreinamento
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedTrainingForDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          trainingName={selectedTrainingForDelete?.resumo || 'Treinamento sem descrição'}
          trainingOrigin={selectedTrainingForDelete?.origem || 'Não informada'}
          trainingBase={selectedTrainingForDelete?.base || 'Aguardando'}
        />
      )}

      <ModalAddBase
        isOpen={addBaseModal}
        onClose={() => setAddBaseModal(false)}
        onConfirm={handleConfirmAddBase}
      />
    </>
  );
};

export default Training;
