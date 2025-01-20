import React from 'react';
import { Eye, Trash2, Beaker } from 'lucide-react';
import { LaboratorioData } from '../types';
import { formatDate } from '../../../utils/formatDate';
import { useProjetos } from '../../../hooks/useProjetos';
import useAuth from '../../../stores/useAuth';

interface LaboratorioTableProps {
  items: LaboratorioData[];
  onView?: (item: LaboratorioData) => void;
  onDelete?: (item: LaboratorioData) => void;
}

const LaboratorioTable: React.FC<LaboratorioTableProps> = ({
  items,
  onView,
  onDelete
}) => {
  const { empresaUid } = useAuth();
  const { projetos } = useProjetos(empresaUid);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

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
              <th className="p-4 font-medium">Criado</th>
              <th className="p-4 font-medium">Projeto</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-center w-48">Gestão</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'var(--bg-primary)' }}>
            {items.map((item) => (
              <tr 
                key={item.uid} 
                className="border-b hover:bg-[var(--bg-hover)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: 'var(--status-success-bg)',
                        border: '1px solid var(--status-success-color)30'
                      }}
                    >
                      <Beaker size={20} style={{ color: 'var(--status-success-color)' }} />
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.nome}
                    </span>
                  </div>
                </td>
                <td className="p-4" style={{ color: 'var(--text-tertiary)' }}>
                  {formatDate(item.dataCriacao)}
                </td>
                <td className="p-4" style={{ color: 'var(--text-tertiary)' }}>
                  {projetosMap[item.projeto]?.nome || '-'}
                </td>
                <td className="p-4" style={{ color: 'var(--text-tertiary)' }}>
                  {item.status}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaboratorioTable;
