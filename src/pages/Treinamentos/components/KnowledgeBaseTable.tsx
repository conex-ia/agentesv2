import React from 'react';
import { Database, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { useProjectNames } from '../../../hooks/useProjectNames';

interface KnowledgeBaseTableProps {
  bases: KnowledgeBase[];
  onView?: (base: KnowledgeBase) => void;
  onDelete?: (base: KnowledgeBase) => void;
}

const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({
  bases,
  onView,
  onDelete,
}) => {
  // Extrair todos os IDs de projetos únicos
  const projectIds = [...new Set(bases.map(base => base.projeto))];
  const { projectNames, loading: loadingProjects } = useProjectNames(projectIds);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy, HH:mm", { locale: ptBR });
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 font-medium text-[var(--text-primary)]">Nome</th>
            <th className="text-left py-4 px-4 font-medium text-[var(--text-primary)]">Criada</th>
            <th className="text-left py-4 px-4 font-medium text-[var(--text-primary)]">Projeto</th>
            <th className="text-left py-4 px-4 font-medium text-[var(--text-primary)]">Treinamentos</th>
            <th className="text-left py-4 px-4 font-medium text-[var(--text-primary)]">Conteúdos</th>
            <th className="text-right py-4 px-4 font-medium text-[var(--text-primary)]">Gestão</th>
          </tr>
        </thead>
        <tbody>
          {bases.map((base) => (
            <tr key={base.uid} className="border-b border-gray-700/50 hover:bg-[var(--bg-secondary)]">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <span className="text-[var(--text-primary)]">{base.nome || '-'}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-[var(--text-secondary)]">
                {base.created_at ? formatDate(base.created_at) : '-'}
              </td>
              <td className="py-4 px-4 text-[var(--text-secondary)]">
                {base.projeto ? (loadingProjects ? '...' : projectNames[base.projeto] || '-') : '-'}
              </td>
              <td className="py-4 px-4 text-[var(--text-secondary)]">
                {base.treinamentos_qtd || 0}
              </td>
              <td className="py-4 px-4">
                {base.treinamentos && base.treinamentos.length > 0 ? (
                  <div className="space-y-1">
                    {base.treinamentos.slice(0, 3).map((treinamento, index) => (
                      <div key={index} className="text-[var(--text-secondary)]">
                        {treinamento}
                      </div>
                    ))}
                    {base.treinamentos.length > 3 && (
                      <div className="text-emerald-500 text-sm">
                        (...) Clique em visualizar
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[var(--text-secondary)]">-</span>
                )}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView?.(base)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(base)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KnowledgeBaseTable;
