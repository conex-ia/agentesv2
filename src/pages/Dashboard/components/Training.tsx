import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { useTrainingData } from '../../../hooks/useTrainingData';
import type { TrainingData } from '../../../types/training';
import useAuth from '../../../stores/useAuth';
import TrainingModal from './TrainingModal';
import { TreinamentoHeader } from '../../Treinamentos/components/TreinamentoHeader';
import TreinamentoGrid from '../../Treinamentos/components/TreinamentoGrid';
import ModalDeleteTreinamento from './Training/components/ModalDeleteTreinamento';

interface TrainingProps {
  trainings: TrainingData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
  viewMode: 'grid' | 'table';
}

const Training: React.FC<TrainingProps> = ({
  trainings,
  currentPage,
  onPageChange,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining,
  viewMode
}) => {
  const [viewType, setViewType] = useState<'grid' | 'table'>(viewMode);

  const handleViewTypeChange = (type: 'grid' | 'table') => {
    setViewType(type);
  };

  return (
    <div className="space-y-8">
      <TreinamentoHeader
        viewType={viewType}
        onViewTypeChange={handleViewTypeChange}
        onAddClick={() => {}}
        isAddingTraining={false}
      />

      <TreinamentoGrid
        trainings={trainings}
        viewType={viewType}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onOpenModal={onOpenModal}
        onOpenDeleteModal={onOpenDeleteModal}
        isDeletingTraining={isDeletingTraining}
      />
    </div>
  );
};

export default Training;
