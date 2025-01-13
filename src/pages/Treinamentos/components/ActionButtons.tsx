import React from 'react';
import { Trash2, Upload } from 'lucide-react';
import type { TrainingData } from '../../../types/training';

interface ActionButtonsProps {
  training: TrainingData;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  training,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  return (
    <div className="flex justify-end gap-2">
      {training.fase !== 'finalizado' && (
        <button
          onClick={() => onOpenModal(training.uid, training.fase)}
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:shadow-lg"
          style={{ 
            backgroundColor: 'rgba(0, 209, 157, 0.1)',
            color: '#00D19D',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Upload size={20} />
        </button>
      )}
      <button
        onClick={() => onOpenDeleteModal(training)}
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:shadow-lg"
        disabled={isDeletingTraining === training.uid}
        style={{ 
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          color: '#FF4757',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};
