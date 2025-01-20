import React, { useMemo, useState, useEffect } from 'react';
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
  // Estado local para controlar loading e dados renderizados
  const [isLoading, setIsLoading] = useState(true);
  const [renderedBases, setRenderedBases] = useState<KnowledgeBase[]>([]);

  // Extrair todos os IDs de projetos únicos com useMemo
  const projectIds = useMemo(() => 
    [...new Set(bases.map(base => base.projeto).filter((id): id is string => id !== null))],
    [bases]
  );

  const { projectNames, loading: loadingProjects } = useProjectNames(projectIds);

  // Efeito para atualizar os dados renderizados com delay
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRenderedBases(bases);
      setIsLoading(false);
    }, 100); // Pequeno delay para garantir que o DOM esteja pronto

    return () => clearTimeout(timer);
  }, [bases]);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy, HH:mm", { locale: ptBR });
  };

  // Gera uma key única baseada nos dados
  const tableKey = useMemo(() => {
    const baseIds = bases.map(base => base.uid).join('-');
    const projectNameKeys = Object.keys(projectNames).sort().join('-');
    return `${baseIds}-${projectNameKeys}`;
  }, [bases, projectNames]);

  return (
    <div className="w-full" key={tableKey}>
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
        <tbody style={{ opacity: isLoading ? '0.5' : '1', transition: 'opacity 0.2s ease-in-out' }}>
          {renderedBases.map((base) => (
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
                <div className="flex items-center justify-end gap-4">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => onView?.(base)}
                      className="p-2 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0, 209, 157, 0.1)' }}
                    >
                      <Eye className="w-5 h-5" style={{ color: '#00D19D' }} />
                    </button>
                    <span className="text-xs mt-1" style={{ color: '#00D19D' }}>
                      ver
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => onDelete?.(base)}
                      className="p-2 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 71, 87, 0.1)' }}
                    >
                      <Trash2 className="w-5 h-5" style={{ color: '#FF4757' }} />
                    </button>
                    <span className="text-xs mt-1" style={{ color: '#FF4757' }}>
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
  );
};

export default KnowledgeBaseTable;
