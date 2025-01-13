import React from 'react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingData } from '../../../types/training';
import { StatusIndicator } from './StatusIndicator';
import { ActionButtons } from './ActionButtons';

interface TreinamentoTableProps {
  trainings: TrainingData[];
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

export const TreinamentoTable: React.FC<TreinamentoTableProps> = ({
  trainings,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  const formatDate = (dateString: string) => {
    const date = addHours(new Date(dateString), -3);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
            <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Resumo</th>
            <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Origem</th>
            <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Base</th>
            <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Data</th>
            <th className="text-center py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
            <th className="text-center py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map((training) => (
            <tr
              key={training.uid}
              className="border-b transition-colors hover:bg-opacity-50"
              style={{ 
                borderColor: 'var(--border-color)',
                '&:hover': {
                  backgroundColor: 'var(--bg-hover)'
                }
              }}
            >
              <td className="py-4 px-4" style={{ color: 'var(--text-primary)' }}>
                {training.resumo || 'Sem descrição'}
              </td>
              <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                {training.origem || 'Não informada'}
              </td>
              <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                {training.base || 'Aguardando'}
              </td>
              <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(training.created_at)}
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex justify-center">
                  <StatusIndicator status={training.fase} />
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex justify-center">
                  <ActionButtons
                    training={training}
                    onOpenModal={onOpenModal}
                    onOpenDeleteModal={onOpenDeleteModal}
                    isDeletingTraining={isDeletingTraining}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
