import React from 'react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingData } from '../../../types/training';
import { StatusIndicator } from '../../Treinamentos/components/StatusIndicator';
import { Package } from 'lucide-react';
import { ProdutoActionButtons } from './ProdutoActionButtons';
import { useProjectNames } from '../../../hooks/useProjectNames';

interface ProdutoCardProps {
  training: TrainingData;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: TrainingData) => void;
  isDeletingTraining: string | null;
}

const ProdutoCard: React.FC<ProdutoCardProps> = ({
  training,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}) => {
  const { projectNames } = useProjectNames([training.projeto].filter(Boolean) as string[]);

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
      className="rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid var(--status-success-color)30'
              }}
            >
              <Package size={24} style={{ color: 'var(--status-success-color)' }} />
            </div>
            <div>
              <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {training.projeto ? projectNames[training.projeto] || '-' : '-'}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {training.created_at ? formatDate(training.created_at) : '-'}
              </p>
            </div>
          </div>
          <StatusIndicator phase={training.phase} />
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Base</p>
            <p style={{ color: 'var(--text-primary)' }}>{formatBaseName(training.base)}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Origem</p>
            <p style={{ color: 'var(--text-primary)' }}>{training.origem || 'Não informado'}</p>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Resumo</p>
            <p style={{ color: 'var(--text-primary)' }}>{training.resumo || 'Não informado'}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <ProdutoActionButtons
            training={training}
            onOpenModal={onOpenModal}
            onOpenDeleteModal={onOpenDeleteModal}
            isDeletingTraining={isDeletingTraining}
          />
        </div>
      </div>
    </div>
  );
};

export default ProdutoCard;
