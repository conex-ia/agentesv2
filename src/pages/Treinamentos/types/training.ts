export interface TrainingData {
  uid: string;
  resumo: string;
  origem: string;
  base: string;
  fase: string;
  created_at: string;
  updated_at: string;
  tipo?: string;
}

export interface TrainingProps {
  trainings: TrainingData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  onOpenTrainingModal: () => void;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

export interface TrainingGridProps {
  trainings: TrainingData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

export interface ActionButtonProps {
  onOpenDeleteModal: (training: TrainingData) => void;
  training: TrainingData;
} 