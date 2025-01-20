import React from 'react';
import { Eye, Trash2, Beaker } from 'lucide-react';
import { LaboratorioData } from '../types';
import { formatDate } from '../../../utils/formatDate';

interface LaboratorioCardProps {
  item: LaboratorioData;
  onView?: (item: LaboratorioData) => void;
  onDelete?: (item: LaboratorioData) => void;
}

const LaboratorioCard: React.FC<LaboratorioCardProps> = ({
  item,
  onView,
  onDelete
}) => {
  return (
    <div 
      className="rounded-lg p-4 transition-all duration-200 hover:scale-[1.02]"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-color)30'
            }}
          >
            <Beaker size={24} style={{ color: 'var(--status-success-color)' }} />
          </div>
          <div>
            <h3 
              className="font-medium mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {item.nome}
            </h3>
            {item.descricao && (
              <p 
                className="text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.descricao}
              </p>
            )}
            <p 
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Criado em {formatDate(item.dataCriacao)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 flex items-center justify-end gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
        {onView && (
          <button
            onClick={() => onView(item)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Eye size={20} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default LaboratorioCard;
