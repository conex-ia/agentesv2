import React from 'react';
import { Clock, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingData } from '../types';

interface TrainingCardProps {
  training: TrainingData;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
  compact?: boolean;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
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
      className="!bg-transparent backdrop-blur-sm rounded-lg p-4 flex flex-col gap-4 border"
      style={{ 
        backgroundColor: 'var(--card-bg) !important',
        borderColor: 'var(--card-border)',
        color: 'var(--text-primary)'
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Criado em</span>
          <p style={{ color: 'var(--text-primary)' }}>{formatDate(training.created_at)}</p>
        </div>
        <div className="flex flex-col items-center">
          {training.fase === 'finalizado' ? (
            <>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--status-success-bg)' }}
              >
                <CheckCircle2 size={24} style={{ color: 'var(--status-success-color)' }} />
              </div>
              <span className="text-xs mt-1" style={{ color: 'var(--status-success-color)' }}>Finalizado</span>
            </>
          ) : (
            <>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--status-warning-bg)' }}
              >
                <Clock size={24} style={{ color: 'var(--status-warning-color)' }} />
              </div>
              <span className="text-xs mt-1" style={{ color: 'var(--status-warning-color)' }}>Aguardando</span>
            </>
          )}
        </div>
      </div>

      <div>
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Tipo</span>
        <p style={{ color: 'var(--text-primary)' }}>{training.tipo || 'Não informado'}</p>
      </div>

      <div>
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Origem</span>
        <p style={{ color: 'var(--text-primary)' }}>{training.origem || 'Não informada'}</p>
      </div>

      <div>
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Resumo</span>
        <p style={{ color: 'var(--text-primary)' }}>{training.resumo || 'Não informado'}</p>
      </div>

      <div>
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Base</span>
        <p style={{ color: 'var(--text-primary)' }}>{training.base || 'Aguardando'}</p>
      </div>

      <div className="flex items-center justify-end gap-4 mt-2">
        {(!training.base || training.base === 'Aguardando') && (
          <div className="flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(training.uid, training.fase);
              }}
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)'
              }}
            >
              <FileText size={24} />
            </button>
            <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              visualizar
            </span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDeleteModal(training);
            }}
            disabled={isDeletingTraining === training.uid}
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'var(--status-error-bg)',
              color: 'var(--status-error-color)'
            }}
          >
            <Trash2 size={24} />
          </button>
          <span className="text-xs mt-1" style={{ color: 'var(--status-error-color)' }}>excluir</span>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
