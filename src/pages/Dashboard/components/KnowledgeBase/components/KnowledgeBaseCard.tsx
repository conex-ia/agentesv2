import React from 'react';
import { Database, Eye, Trash2 } from 'lucide-react';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';
import { formatDate } from '../../../../../utils/formatDate';
import { useProjetos } from '../../../../../hooks/useProjetos';
import useAuth from '../../../../../stores/useAuth';

interface KnowledgeBaseCardProps {
  base: KnowledgeBase;
  onOpenViewModal: (base: KnowledgeBase) => void;
  onOpenDeleteModal: (base: KnowledgeBase) => void;
  isDeletingBase: string | null;
}

export const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  base,
  onOpenViewModal,
  onOpenDeleteModal,
  isDeletingBase
}) => {
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetos(empresaUid);

  console.log('KnowledgeBaseCard - empresaUid:', empresaUid);
  console.log('KnowledgeBaseCard - projetos:', projetos);
  console.log('KnowledgeBaseCard - base.projeto:', base.projeto);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    if (!projetos) return {};
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

  const renderConteudos = () => {
    if (!base.treinamentos || base.treinamentos.length === 0) {
      return <div style={{ color: 'var(--text-tertiary)' }}>Nenhum conteúdo adicionado</div>;
    }

    return (
      <div style={{ color: 'var(--text-tertiary)' }}>
        {base.treinamentos.slice(0, 2).map((treinamento, index) => (
          <div key={index} className="mb-1 last:mb-0">
            {treinamento}
          </div>
        ))}
        {base.treinamentos.length > 2 && (
          <div 
            style={{ color: 'var(--status-success-color)' }} 
            className="text-sm cursor-pointer hover:underline" 
            onClick={() => onOpenViewModal(base)}
          >
            (...) Clique em visualizar
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="rounded-lg p-4 flex flex-col min-h-[300px]"
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)'
      }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--status-success-bg)' }}
          >
            <Database size={20} style={{ color: 'var(--status-success-color)' }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-medium text-white">
                {base.nome.split('_')[0]}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Criada em</span>
                <span style={{ color: 'var(--text-tertiary)' }} className="text-sm">{formatDate(base.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Projeto</span>
            <div style={{ color: 'var(--text-tertiary)' }}>
              {projetosLoading ? (
                <div 
                  className="animate-pulse h-5 w-32 rounded mt-1"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                ></div>
              ) : (
                base.projeto ? projetosMap[base.projeto]?.nome || 'Projeto não encontrado' : '-'
              )}
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Treinamentos</span>
            <div style={{ color: 'var(--text-tertiary)' }}>{base.treinamentos_qtd || 0}</div>
          </div>

          <div>
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Conteúdos</span>
            <div className="mt-1">
              {renderConteudos()}
            </div>
          </div>
        </div>
      </div>

      <div 
        className="flex items-center justify-end gap-2 pt-4 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <button
          type="button"
          onClick={() => onOpenViewModal(base)}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--status-success-bg)' }}
        >
          <Eye size={24} style={{ color: 'var(--status-success-color)' }} />
        </button>
        <button
          type="button"
          onClick={() => onOpenDeleteModal(base)}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--status-error-bg)' }}
          disabled={isDeletingBase === base.uid}
        >
          <Trash2 size={24} style={{ color: 'var(--status-error-color)' }} />
        </button>
      </div>
    </div>
  );
};
