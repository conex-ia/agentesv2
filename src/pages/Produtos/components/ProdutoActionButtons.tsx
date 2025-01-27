import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import type { TrainingData } from '../../../types/training';

interface ProdutoActionButtonsProps {
  training: TrainingData;
  onOpenModal: (id: string, fase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

export const ProdutoActionButtons: React.FC<ProdutoActionButtonsProps> = ({
  training,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Só mostra o botão de upload se não estiver finalizado */}
      {training.fase !== 'finalizado' && (
        <button
          onClick={() => onOpenModal(training.uid, training.fase)}
          className="flex flex-col items-center"
        >
          <div
            className="p-2 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: 'rgba(0, 209, 157, 0.1)' }}
          >
            <Upload className="w-5 h-5" style={{ color: '#00D19D' }} />
          </div>
          <span className="text-xs mt-1" style={{ color: '#00D19D' }}>
            Upload
          </span>
        </button>
      )}
      
      <button
        onClick={() => onOpenDeleteModal(training)}
        disabled={isDeletingTraining === training.uid}
        className={`flex flex-col items-center ${
          isDeletingTraining === training.uid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div
          className="p-2 rounded-lg shadow-lg flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)' }}
        >
          <Trash2 className="w-5 h-5" style={{ color: '#FF4757' }} />
        </div>
        <span className="text-xs mt-1" style={{ color: '#FF4757' }}>
          Excluir
        </span>
      </button>
    </div>
  );
};
