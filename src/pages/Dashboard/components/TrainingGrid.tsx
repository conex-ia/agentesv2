import React from 'react';
import { Clock, CheckCircle2, FileText, Trash2, Database } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrainingData } from './Training/types';
import Pagination from '../../../components/Pagination';
import TrainingCard from './Training/components/TrainingCard';
import { EmptyState } from '../../../components/EmptyState';

const ITEMS_PER_PAGE = 6;

export interface TrainingGridProps {
  trainings: TrainingData[];
  viewType: 'grid' | 'table';
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

const TrainingGrid: React.FC<TrainingGridProps> = ({
  trainings,
  viewType,
  currentPage,
  onPageChange,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  const formatDate = (dateString: string) => {
    const date = addHours(new Date(dateString), -3);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const totalPages = Math.ceil(trainings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrainings = trainings.slice(startIndex, endIndex);

  if (trainings.length === 0) {
    return (
      <EmptyState
        icon={<Database className="w-12 h-12" />}
        title="Nenhum treinamento"
        description="Você ainda não possui nenhum treinamento. Adicione um novo conteúdo para começar."
      />
    );
  }

  if (viewType === 'grid') {
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTrainings.map(training => (
            <TrainingCard
              key={training.uid}
              training={training}
              onOpenModal={onOpenModal}
              onOpenDeleteModal={onOpenDeleteModal}
              isDeletingTraining={isDeletingTraining}
            />
          ))}
        </div>
        {trainings.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div 
        className="backdrop-blur-sm rounded-lg overflow-hidden border"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="overflow-auto hover:scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent transition-all duration-300">
          <table className="w-full">
            <thead>
              <tr 
                className="text-left border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <th className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Criado</th>
                <th className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Tipo</th>
                <th className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Origem</th>
                <th className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Resumo</th>
                <th className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>Base</th>
                <th className="p-4 font-medium text-center" style={{ color: 'var(--text-secondary)' }}>Status</th>
                <th className="p-4 font-medium text-center w-48" style={{ color: 'var(--text-secondary)' }}>Gestão</th>
              </tr>
            </thead>
            <tbody>
              {currentTrainings.map(training => (
                <tr 
                  key={training.uid} 
                  className="border-b"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <td className="p-4" style={{ color: 'var(--text-primary)' }}>{formatDate(training.created_at)}</td>
                  <td className="p-4" style={{ color: 'var(--text-primary)' }}>{training.tipo || 'Não informado'}</td>
                  <td className="p-4" style={{ color: 'var(--text-primary)' }}>{training.origem || 'Não informada'}</td>
                  <td className="p-4" style={{ color: 'var(--text-primary)' }}>{training.resumo || 'Não informado'}</td>
                  <td className="p-4" style={{ color: 'var(--text-primary)' }}>{training.base || 'Aguardando'}</td>
                  <td className="p-4">
                    <div className="flex flex-col items-center">
                      {training.fase === 'finalizado' ? (
                        <>
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: 'var(--status-success-bg)',
                              boxShadow: '0 4px 14px 0 var(--accent-color-transparent)'
                            }}
                          >
                            <CheckCircle2 
                              size={24} 
                              className="transition-colors"
                              style={{ color: 'var(--status-success-color)' }} 
                            />
                          </div>
                          <span className="text-xs mt-1" style={{ color: 'var(--status-success-color)' }}>Finalizado</span>
                        </>
                      ) : (
                        <>
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: 'var(--status-warning-bg)',
                              boxShadow: '0 4px 14px 0 var(--accent-color-transparent)'
                            }}
                          >
                            <Clock 
                              size={24} 
                              className="transition-colors"
                              style={{ color: 'var(--status-warning-color)' }} 
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {(!training.base || training.base === 'Aguardando') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenModal(training.uid, training.fase);
                          }}
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: 'var(--accent-color-bg)',
                            boxShadow: '0 4px 14px 0 var(--accent-color-transparent)',
                            color: 'var(--accent-color)'
                          }}
                        >
                          <FileText 
                            size={24}
                            className="flex items-center justify-center"
                          />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeleteModal(training);
                        }}
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        disabled={isDeletingTraining === training.uid}
                        style={{ 
                          backgroundColor: 'var(--status-error-bg)',
                          boxShadow: '0 4px 14px 0 var(--accent-color-transparent)',
                          color: 'var(--status-error-color)'
                        }}
                      >
                        <Trash2 
                          size={24}
                          className="flex items-center justify-center"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {trainings.length > ITEMS_PER_PAGE && (
        <div className="mt-4 flex justify-center">
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

export default TrainingGrid;
