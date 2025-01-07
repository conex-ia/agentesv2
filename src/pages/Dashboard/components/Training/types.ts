import { Dispatch, SetStateAction } from 'react';

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
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
  viewMode: 'grid' | 'table';
}

export interface TrainingGridProps {
  trainings: TrainingData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

export interface ActionButtonProps {
  training: TrainingData;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}