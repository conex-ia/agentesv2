import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { KnowledgeBase } from '../../../../hooks/useKnowledgeBases';
import { KnowledgeBaseTable } from './components/KnowledgeBaseTable';
import { KnowledgeBaseCard } from './components/KnowledgeBaseCard';
import { ViewKnowledgeBaseModal } from './components/ViewKnowledgeBaseModal';
import { EmptyState } from '../../../../components/EmptyState';
import { ITEMS_PER_PAGE } from './constants';
import Pagination from '../../../../components/Pagination';
import { ModalDeleteBase } from './components/ModalDeleteBase';
import { ModalAddBase } from './components/ModalAddBase';

interface KnowledgeBaseGridProps {
  bases: KnowledgeBase[];
  viewType: 'grid' | 'table';
  isDeletingBase?: string | null;
  onDeleteBase?: (baseId: string) => Promise<{ success: boolean; message: string }>;
  onAddBase: (name: string, projectId: string) => Promise<string>;
}

export const KnowledgeBaseGrid = ({
  bases,
  viewType,
  isDeletingBase,
  onDeleteBase,
  onAddBase
}: KnowledgeBaseGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingBase, setIsAddingBase] = useState(false);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    base: KnowledgeBase | null;
  }>({ isOpen: false, base: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    base: KnowledgeBase | null;
  }>({ isOpen: false, base: null });

  useEffect(() => {
    setCurrentPage(1);
  }, [viewType, bases.length]);

  const handleOpenViewModal = (base: KnowledgeBase) => {
    console.log('handleOpenViewModal chamado:', base);
    setViewModal({ isOpen: true, base });
  };

  const handleCloseViewModal = () => {
    console.log('handleCloseViewModal chamado');
    setViewModal({ isOpen: false, base: null });
  };

  const handleOpenDeleteModal = (base: KnowledgeBase) => {
    console.log('=== Início do handleOpenDeleteModal ===');
    console.log('1. Estado atual do deleteModal:', deleteModal);
    console.log('2. Base recebida:', base);
    setDeleteModal({ isOpen: true, base });
    console.log('3. Novo estado definido: { isOpen: true, base }');
    console.log('=== Fim do handleOpenDeleteModal ===');
  };

  const handleCloseDeleteModal = () => {
    console.log('=== Início do handleCloseDeleteModal ===');
    console.log('1. Estado atual do deleteModal:', deleteModal);
    setDeleteModal({ isOpen: false, base: null });
    console.log('2. Novo estado definido: { isOpen: false, base: null }');
    console.log('=== Fim do handleCloseDeleteModal ===');
  };

  const handleAddBase = () => {
    console.log('handleAddBase chamado');
    setIsAddingBase(true);
  };

  const handleConfirmAdd = async (nome: string, projetoUid: string) => {
    try {
      console.log('handleConfirmAdd chamado:', { nome, projetoUid });
      const result = await onAddBase(nome, projetoUid);
      console.log('Workflow iniciado:', result);
      setIsAddingBase(false);
      return result;
    } catch (error) {
      console.error('Erro ao adicionar base:', error);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    console.log('handleConfirmDelete chamado');
    if (!deleteModal.base || !onDeleteBase) {
      console.log('Nenhuma base selecionada ou função onDeleteBase não fornecida');
      return { success: false, message: 'Nenhuma base selecionada' };
    }

    try {
      const result = await onDeleteBase(deleteModal.base.uid);
      return { success: result.success, message: result.success ? 'Base excluída com sucesso' : 'Erro ao excluir base' };
    } catch (error) {
      console.error('Erro ao excluir base:', error);
      return { success: false, message: 'Erro ao excluir base' };
    }
  };

  const totalPages = Math.ceil(bases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBases = bases.slice(startIndex, endIndex);

  if (bases.length === 0) {
    return (
      <EmptyState
        icon={<Database className="w-12 h-12" />}
        title="Nenhuma base de conhecimento"
        description="Você ainda não possui nenhuma base de conhecimento. Crie uma nova base para começar."
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBases.map(base => (
              <KnowledgeBaseCard
                key={base.uid}
                base={base}
                onOpenViewModal={handleOpenViewModal}
                onOpenDeleteModal={handleOpenDeleteModal}
                isDeletingBase={isDeletingBase || null}
              />
            ))}
          </div>
        ) : (
          <KnowledgeBaseTable
            bases={currentBases}
            onOpenViewModal={handleOpenViewModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            isDeletingBase={isDeletingBase || null}
          />
        )}

        {bases.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <ViewKnowledgeBaseModal
        isOpen={viewModal.isOpen}
        onClose={handleCloseViewModal}
        base={viewModal.base}
      />

      <ModalDeleteBase
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        base={deleteModal.base}
      />

      <ModalAddBase
        isOpen={isAddingBase}
        onClose={() => setIsAddingBase(false)}
        onConfirm={handleConfirmAdd}
      />
    </>
  );
};