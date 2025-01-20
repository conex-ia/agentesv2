import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../../components/EmptyState';
import DeleteProjetoModal from './DeleteProjetoModal';
import ViewProjetoModal from './ViewProjetoModal';
import { Plus, FolderOpen, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Pagination from '../../../components/Pagination';

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
  currentPage: number;
  onPageChange: (page: number, projetos?: Projeto[]) => void;
  viewType: 'grid' | 'table';
}

const ProjetosGrid = ({
  projetos,
  currentPage,
  onPageChange,
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

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(projetos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjetos = projetos.slice(startIndex, endIndex);

  // Atualiza a página atual quando a lista de projetos muda
  useEffect(() => {
    const totalPages = Math.ceil(projetos.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProjetos = projetos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (currentPage > 1 && currentProjetos.length === 0 && totalPages > 0) {
      onPageChange(Math.max(1, totalPages));
    }
  }, [projetos.length, currentPage]);

  const handleOpenViewModal = (projeto: Projeto) => {
    setViewModal({ isOpen: true, projeto });
  };

  const handleCloseViewModal = () => {
    setViewModal({ isOpen: false, projeto: null });
  };

  const handleOpenDeleteModal = (projeto: Projeto) => {
    setDeleteModal({ isOpen: true, projeto });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, projeto: null });
  };

  const handleDeleteProjeto = async () => {
    if (!deleteModal.projeto) return;
    
    setIsDeletingProjeto(deleteModal.projeto.uid);
    
    try {
      const { error } = await supabase
        .from('conex_projetos')
        .update({ ativo: false })
        .eq('uid', deleteModal.projeto.uid);

      if (error) throw error;

      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
    } finally {
      setIsDeletingProjeto(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {projetos.length === 0 ? (
        <EmptyState
          title="Nenhum projeto encontrado"
          description="Clique no botão acima para adicionar um novo projeto."
          icon={FolderOpen}
        />
      ) : (
        <>
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProjetos.map((projeto) => (
                <motion.div
                  key={projeto.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-4 flex flex-col gap-4 border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                        {projeto.nome}
                      </h3>
                      <div className="mt-1">
                        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Criado em</span>
                        <p style={{ color: 'var(--text-primary)' }}>{formatDate(projeto.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--accent-color-transparent)' }}
                      >
                        <FolderOpen className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => handleOpenViewModal(projeto)}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                        style={{ 
                          backgroundColor: 'var(--status-success-bg)',
                          color: 'var(--status-success-color)'
                        }}
                      >
                        <Eye size={24} />
                      </button>
                      <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                        visualizar
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <button 
                        type="button"
                        onClick={() => handleOpenDeleteModal(projeto)}
                        disabled={isDeletingProjeto === projeto.uid}
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--status-error-bg)',
                          color: 'var(--status-error-color)'
                        }}
                      >
                        <Trash2 size={24} />
                      </button>
                      <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                        excluir
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-sm shadow-lg w-full rounded-lg overflow-hidden">
              <div 
                className="overflow-x-auto custom-scrollbar"
                style={{ 
                  backgroundColor: 'var(--table-header-bg)',
                  color: 'var(--text-primary)'
                }}
              >
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr 
                      className="text-left border-b" 
                      style={{ 
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">Data de Criação</th>
                      <th className="p-4 font-medium text-center w-48">Ações</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: 'var(--bg-primary)' }}>
                    {currentProjetos.map((projeto) => (
                      <tr 
                        key={projeto.uid} 
                        className="border-b"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: 'var(--status-success-bg)' }}
                            >
                              <FolderOpen size={20} style={{ color: 'var(--status-success-color)' }} />
                            </div>
                            <span style={{ color: 'var(--text-primary)' }}>{projeto.nome}</span>
                          </div>
                        </td>
                        <td className="p-4" style={{ color: 'var(--text-primary)' }}>
                          {formatDate(projeto.created_at)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center">
                              <button 
                                type="button"
                                onClick={() => handleOpenViewModal(projeto)}
                                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                                style={{ 
                                  backgroundColor: 'var(--status-success-bg)',
                                  color: 'var(--status-success-color)'
                                }}
                              >
                                <Eye size={24} />
                              </button>
                              <span className="text-[9px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                                visualizar
                              </span>
                            </div>
                            <div className="flex flex-col items-center">
                              <button 
                                type="button"
                                onClick={() => handleOpenDeleteModal(projeto)}
                                disabled={isDeletingProjeto === projeto.uid}
                                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ 
                                  backgroundColor: 'var(--status-error-bg)',
                                  color: 'var(--status-error-color)'
                                }}
                              >
                                <Trash2 size={24} />
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
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}

      <ViewProjetoModal
        isOpen={viewModal.isOpen}
        projeto={viewModal.projeto}
        onClose={handleCloseViewModal}
      />

      <DeleteProjetoModal
        isOpen={deleteModal.isOpen}
        projeto={deleteModal.projeto}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteProjeto}
        isLoading={isDeletingProjeto === deleteModal.projeto?.uid}
      />
    </div>
  );
};

export default ProjetosGrid;
