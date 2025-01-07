import React from 'react';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../../utils/formatDate';
import { Training } from '../types';
import { StatusIndicator } from './StatusIndicator';

interface TrainingTableProps {
  trainings: Training[];
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: Training) => void;
  isDeletingTraining: string | null;
}

const TrainingTable: React.FC<TrainingTableProps> = ({
  trainings,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  return (
    <div className="backdrop-blur-sm shadow-lg w-full rounded-lg overflow-hidden">
      <div 
        className="overflow-x-auto custom-scrollbar"
        style={{ 
          backgroundColor: 'var(--table-header-bg)',
          color: 'var(--text-primary)'
        }}
      >
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr 
              className="text-left border-b" 
              style={{ 
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-color)'
              }}
            >
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Criado</th>
              <th className="p-4 font-medium">Origem</th>
              <th className="p-4 font-medium">Base</th>
              <th className="p-4 font-medium">Resumo</th>
              <th className="p-4 font-medium text-center w-48">Gestão</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr 
                key={training.uid} 
                className="border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <td className="p-4">
                  <StatusIndicator phase={training.fase} />
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {formatDate(training.created_at)}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {training.origem || '-'}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {training.base || '-'}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {training.resumo || 'Sem descrição'}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => onOpenModal(training.uid, training.fase)}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--status-success-bg)',
                          color: 'var(--status-success-color)'
                        }}
                      >
                        <FileText size={24} />
                      </button>
                      <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                        visualizar
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
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
                      <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                        excluir
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" style={{ backgroundColor: 'var(--bg-primary)' }}></div>
    </div>
  );
};

export { TrainingTable };
