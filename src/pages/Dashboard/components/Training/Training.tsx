import React from 'react';
import { motion } from 'framer-motion';
import TrainingCard from './components/TrainingCard';
import { TrainingTable } from './components/TrainingTable';
import ModalDeleteTreinamento from './components/ModalDeleteTreinamento';
import type { TrainingData, TrainingProps } from './types';
import { ITEMS_PER_PAGE } from './constants';

const Training = React.memo(function Training({
  trainings,
  currentPage,
  onPageChange,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining,
  viewMode
}: TrainingProps) {
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedTrainingForDelete, setSelectedTrainingForDelete] = React.useState<TrainingData | null>(null);

  const handleOpenDeleteModal = (training: TrainingData) => {
    setSelectedTrainingForDelete(training);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTrainingForDelete) {
      onOpenDeleteModal(selectedTrainingForDelete);
      setDeleteModalOpen(false);
      setSelectedTrainingForDelete(null);
      return { success: true, message: 'Treinamento excluído com sucesso' };
    }
    return { success: false, message: 'Nenhum treinamento selecionado' };
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrainings = trainings.slice(startIndex, endIndex);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 pb-4 sm:pb-6"
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTrainings.map((training) => (
              <TrainingCard
                key={training.uid}
                training={training}
                onOpenModal={onOpenModal}
                onOpenDeleteModal={handleOpenDeleteModal}
                isDeletingTraining={isDeletingTraining}
              />
            ))}
          </div>
        ) : (
          <TrainingTable
            trainings={currentTrainings}
            onOpenModal={onOpenModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            isDeletingTraining={isDeletingTraining}
          />
        )}
      </motion.div>

      {isDeleteModalOpen && selectedTrainingForDelete && (
        <ModalDeleteTreinamento
          isOpen={isDeleteModalOpen}
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
    </div>
  );
});

Training.displayName = 'Training';

export default Training; 