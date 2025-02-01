import { useState } from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../../components/EmptyState';
import DeleteProjetoModal from './DeleteProjetoModal';
import ViewProjetoModal from './ViewProjetoModal';
import { Plus, FolderOpen, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export interface Projeto {
  uid: string;
  nome: string;
  created_at: string;
  empresa: string;
  treinamentos?: string;
  bases?: string[];
}

interface ProjetosGridProps {
  projetos: Projeto[];
  viewType: 'grid' | 'table';
}

const ProjetosGrid = ({
  projetos,
  viewType
}: ProjetosGridProps) => {
  const [isDeletingProjeto, setIsDeletingProjeto] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    projeto: Projeto | null;
  }>({ isOpen: false, projeto: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    projeto: Projeto | null;
  }>({ isOpen: false, projeto: null });

  const handleDeleteProjeto = async (projeto: Projeto) => {
    try {
      setIsDeletingProjeto(projeto.uid);
      console.log('[ProjetosGrid] Iniciando exclusão do projeto:', projeto);
      
      // Fazer soft delete atualizando ativo = false
      const { error } = await supabase
        .from('conex_projetos')
        .update({ ativo: false })
        .eq('uid', projeto.uid);

      if (error) throw error;

      console.log('[ProjetosGrid] Projeto excluído com sucesso');
    } catch (error) {
      console.error('[ProjetosGrid] Erro ao deletar projeto:', error);
    } finally {
      // Importante: resetar o estado de deleting após a conclusão
      console.log('[ProjetosGrid] Finalizando estado de exclusão');
      setIsDeletingProjeto(null);
    }
  };

  if (projetos.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado"
        description="Comece criando um novo projeto"
        icon={FolderOpen}
      />
    );
  }

  return (
    <>
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projetos.map((projeto) => (
            <motion.div
              key={projeto.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative group"
            >
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: 'var(--sidebar-bg)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FolderOpen className="w-5 h-5 text-emerald-500" />
                  <h3
                    className="text-lg font-medium truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {projeto.nome}
                  </h3>
                </div>

                <div className="border-t border-gray-700/50 pt-4 space-y-2 mb-4">
                  <div>
                    <span className="text-[var(--text-secondary)] text-sm">Criado em:</span>
                    <div className="text-[var(--text-primary)]">
                      {new Date(projeto.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[var(--text-secondary)] text-sm">Treinamentos:</span>
                    <div className="text-[var(--text-primary)]">{projeto.treinamentos || 0}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setViewModal({ isOpen: true, projeto })}
                    className="flex flex-col items-center"
                  >
                    <div className="p-2 rounded-lg shadow-lg bg-emerald-500/10">
                      <Eye className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-xs text-emerald-500 mt-1">ver</span>
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, projeto })}
                    className="flex flex-col items-center"
                    disabled={isDeletingProjeto === projeto.uid}
                  >
                    <div className="p-2 rounded-lg shadow-lg bg-red-500/10">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-xs text-red-500 mt-1">excluir</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Nome
                </th>
                <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Data de Criação
                </th>
                <th className="text-left py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Treinamentos
                </th>
                <th className="text-right py-4 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Gestão
                </th>
              </tr>
            </thead>
            <tbody>
              {projetos.map((projeto) => (
                <tr
                  key={projeto.uid}
                  className="border-b"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-5 h-5 text-emerald-500" />
                      <span style={{ color: 'var(--text-primary)' }}>{projeto.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(projeto.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4" style={{ color: 'var(--text-secondary)' }}>
                    {projeto.treinamentos || 0}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewModal({ isOpen: true, projeto })}
                        className="flex flex-col items-center"
                      >
                        <div className="p-2 rounded-lg shadow-lg bg-emerald-500/10">
                          <Eye className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-xs text-emerald-500 mt-1">ver</span>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, projeto })}
                        className="flex flex-col items-center"
                        disabled={isDeletingProjeto === projeto.uid}
                      >
                        <div className="p-2 rounded-lg shadow-lg bg-red-500/10">
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-xs text-red-500 mt-1">excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ViewProjetoModal
        isOpen={viewModal.isOpen}
        projeto={viewModal.projeto}
        onClose={() => setViewModal({ isOpen: false, projeto: null })}
      />

      <DeleteProjetoModal
        isOpen={deleteModal.isOpen}
        projeto={deleteModal.projeto}
        onClose={() => setDeleteModal({ isOpen: false, projeto: null })}
        onConfirm={() => deleteModal.projeto && handleDeleteProjeto(deleteModal.projeto)}
        isDeleting={isDeletingProjeto === deleteModal.projeto?.uid}
      />
    </>
  );
};

export default ProjetosGrid;
