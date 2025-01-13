import React from 'react';
import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingData } from '../../../types/training';
import { StatusIndicator } from './StatusIndicator';
import { ActionButtons } from './ActionButtons';

interface TreinamentoCardProps {
  training: TrainingData;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

const TreinamentoCard: React.FC<TreinamentoCardProps> = ({
  training,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  const formatDate = (dateString: string) => {
    const date = addHours(new Date(dateString), -3);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div 
      className="rounded-lg p-6 space-y-4 h-full"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)'
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 style={{ color: 'var(--text-primary)' }} className="font-medium">
          {training.resumo || 'Não informado'}
        </h3>
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Criado em</span>
          <span style={{ color: 'var(--text-tertiary)' }} className="text-sm">
            {formatDate(training.created_at)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Origem</span>
          <div style={{ color: 'var(--text-tertiary)' }}>
            {training.origem || 'Não informada'}
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Base</span>
          <div style={{ color: 'var(--text-tertiary)' }}>
            {training.base || 'Aguardando'}
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Status</span>
          <div className="mt-2 flex justify-center">
            <StatusIndicator status={training.fase} />
          </div>
        </div>
      </div>

      <div 
        className="flex items-center justify-end gap-2 pt-4 mt-4 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <ActionButtons
          training={training}
          onOpenModal={onOpenModal}
          onOpenDeleteModal={onOpenDeleteModal}
          isDeletingTraining={isDeletingTraining}
        />
      </div>
    </div>
  );
};

export default TreinamentoCard;
