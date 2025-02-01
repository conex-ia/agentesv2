import React from 'react';
import type { TrainingData } from '../../../types/training';
import Pagination from '../../../components/Pagination';
import ProdutoCard from './ProdutoCard';
import { ProdutoTable } from './ProdutoTable';
import { Package } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

interface ProdutoGridProps {
  trainings: TrainingData[];
  viewType: 'grid' | 'table';
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

const ProdutoGrid: React.FC<ProdutoGridProps> = ({
  trainings,
  viewType,
  currentPage,
  onPageChange,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  const totalPages = Math.ceil(trainings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrainings = trainings.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4 mt-4 mb-8">
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrainings.map(training => (
            <ProdutoCard
              key={training.uid}
              training={training}
              onOpenModal={onOpenModal}
              onOpenDeleteModal={onOpenDeleteModal}
              isDeletingTraining={isDeletingTraining}
            />
          ))}
        </div>
      ) : (
        <div className="backdrop-blur-sm shadow-lg rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <ProdutoTable
            trainings={currentTrainings}
            onOpenModal={onOpenModal}
            onOpenDeleteModal={onOpenDeleteModal}
            isDeletingTraining={isDeletingTraining}
          />
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(ProdutoGrid, (prevProps, nextProps) => {
  return (
    prevProps.trainings === nextProps.trainings &&
    prevProps.viewType === nextProps.viewType &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.isDeletingTraining === nextProps.isDeletingTraining
  );
});
