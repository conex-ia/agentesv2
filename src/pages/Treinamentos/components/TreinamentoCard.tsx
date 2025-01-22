import React from 'react';
import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingData } from '../../../types/training';
import { StatusIndicator } from './StatusIndicator';
import { ActionButtons } from './ActionButtons';
import { useProjectNames } from '../../../hooks/useProjectNames';
import { FolderOpen } from 'lucide-react';

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
  // Buscar nome do projeto se houver um projeto vinculado
  const projectIds = training.projeto ? [training.projeto] : [];
  const { projectNames, loading: loadingProjects } = useProjectNames(projectIds);

  const formatDate = (dateString: string) => {
    const date = addHours(new Date(dateString), -3);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatBaseName = (nome: string | null | undefined) => {
    if (!nome || nome === 'Aguardando') return nome || 'Aguardando';
    return nome.split('_')[0];
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
        <h3 style={{ color: 'var(--text-tertiary)' }} className="font-medium">
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
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Projeto</span>
          <div className="flex items-center gap-3 mt-1">
            <div 
              className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid var(--status-success-color)30'
              }}
            >
              <FolderOpen size={20} style={{ color: 'var(--status-success-color)' }} />
            </div>
            <span style={{ color: 'var(--text-tertiary)' }}>
              {training.projeto ? (loadingProjects ? '...' : projectNames[training.projeto] || '-') : '-'}
            </span>
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Origem</span>
          <div style={{ color: 'var(--text-tertiary)' }}>
            {training.origem || 'Não informada'}
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Base</span>
          <div style={{ color: 'var(--text-tertiary)' }}>
            {formatBaseName(training.base)}
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Status</span>
          <div className="mt-2 flex items-center justify-between">
            <StatusIndicator status={training.fase} />
            <div className="flex items-center gap-2">
              <ActionButtons
                training={training}
                onOpenModal={onOpenModal}
                onOpenDeleteModal={onOpenDeleteModal}
                isDeletingTraining={isDeletingTraining}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreinamentoCard;
