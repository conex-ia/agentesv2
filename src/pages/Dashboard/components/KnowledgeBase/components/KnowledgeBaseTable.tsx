import React from 'react';
import { Database, Eye, Trash2 } from 'lucide-react';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';
import { formatDate } from '../../../../../utils/formatDate';
import { useProjetos } from '../../../../../hooks/useProjetos';
import useAuth from '../../../../../stores/useAuth';

interface KnowledgeBaseTableProps {
  bases: KnowledgeBase[];
  onOpenViewModal: (base: KnowledgeBase) => void;
  onOpenDeleteModal: (base: KnowledgeBase) => void;
  isDeletingBase: string | null;
}

const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({
  bases,
  onOpenViewModal,
  onOpenDeleteModal,
  isDeletingBase
}) => {
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetos(empresaUid);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

  const renderConteudos = (base: KnowledgeBase) => {
    if (!base.treinamentos || base.treinamentos.length === 0) {
      return <div style={{ color: 'var(--text-secondary)' }}>-</div>;
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
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Criada</th>
              <th className="p-4 font-medium">Projeto</th>
              <th className="p-4 font-medium">Treinamentos</th>
              <th className="p-4 font-medium">Conteúdos</th>
              <th className="p-4 font-medium text-center w-48">Gestão</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'var(--bg-primary)' }}>
            {bases.map((base) => (
              <tr 
                key={base.uid} 
                className="border-b"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                      <Database size={20} style={{ color: 'var(--status-success-color)' }} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-primary)' }} className="font-medium">
                        {base.nome.split('_')[0]}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {formatDate(base.created_at)}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {projetosLoading ? (
                    <div 
                      className="animate-pulse h-6 w-32 rounded"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    />
                  ) : (
                    projetosMap[base.projeto]?.nome || '-'
                  )}
                </td>
                <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                  {base.treinamentos?.length || 0}
                </td>
                <td className="p-4">
                  {renderConteudos(base)}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => onOpenViewModal(base)}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                        style={{ 
                          backgroundColor: 'var(--status-success-bg)',
                          ':hover': { 
                            backgroundColor: 'var(--status-success-bg)',
                            opacity: '0.8'
                          }
                        }}
                      >
                        <Eye size={24} style={{ color: 'var(--status-success-color)' }} />
                      </button>
                      <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                        visualizar
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => onOpenDeleteModal(base)}
                        disabled={isDeletingBase === base.uid}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--status-error-bg)',
                          ':hover': { 
                            backgroundColor: 'var(--status-error-bg)',
                            opacity: '0.8'
                          }
                        }}
                      >
                        <Trash2 size={24} style={{ color: 'var(--status-error-color)' }} />
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
    </div>
  );
};

export { KnowledgeBaseTable };