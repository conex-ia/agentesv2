import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { KnowledgeBase } from '../../../../hooks/useKnowledgeBases';
import { EmptyState } from '../../../../components/EmptyState';
import { KnowledgeBaseTable } from './components/KnowledgeBaseTable';
import { ITEMS_PER_PAGE } from './constants';
import Pagination from '../../../../components/Pagination';
import KnowledgeBaseHeader from './components/KnowledgeBaseHeader';
import ModalDeleteBase from './components/ModalDeleteBase';
import { supabase } from '../../../../lib/supabase';

interface KnowledgeBaseGridProps {
  bases: KnowledgeBase[];
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

export const KnowledgeBaseGrid = ({
  bases,
  viewType,
  onViewTypeChange
}: KnowledgeBaseGridProps) => {
  console.log('KnowledgeBaseGrid renderizado:', { bases, viewType });

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

  // Reset para página 1 quando mudar o viewType ou quando a quantidade de bases mudar
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
    console.log('handleOpenDeleteModal chamado:', base);
    setDeleteModal({ isOpen: true, base });
  };

  const handleCloseDeleteModal = () => {
    console.log('handleCloseDeleteModal chamado');
    setDeleteModal({ isOpen: false, base: null });
  };

  const handleAddBase = () => {
    console.log('handleAddBase chamado');
    setIsAddingBase(true);
  };

  const handleConfirmDelete = async () => {
    console.log('handleConfirmDelete chamado');
    if (!deleteModal.base) {
      console.log('Nenhuma base selecionada');
      return { success: false, message: 'Nenhuma base selecionada' };
    }

    try {
      console.log('Iniciando exclusão da base:', deleteModal.base);
      // Primeiro faz o soft delete da base (update ativa = false)
      const { error: updateError } = await supabase
        .from('conex-bases_t')
        .update({ ativa: false })
        .eq('uid', deleteModal.base.uid);

      if (updateError) {
        console.error('Erro ao fazer soft delete:', updateError);
        throw updateError;
      }

      // Aguarda 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Depois faz o hard delete da base
      const { error: deleteError } = await supabase
        .from('conex-bases_t')
        .delete()
        .eq('uid', deleteModal.base.uid);

      if (deleteError) {
        console.error('Erro ao fazer hard delete:', deleteError);
        throw deleteError;
      }

      console.log('Base excluída com sucesso');
      return { success: true, message: 'Base excluída com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir base:', error);
      return { success: false, message: 'Erro ao excluir base' };
    }
  };

  if (bases.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="Ainda não existem Bases de Conhecimento"
        description="Clique em 'Adicionar Base' para começar a criar suas bases de conhecimento."
      />
    );
  }

  console.log('Total bases:', bases.length);
  const totalPages = Math.ceil(bases.length / ITEMS_PER_PAGE);
  console.log('Total pages:', totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBases = bases.slice(startIndex, endIndex);

  return (
    <>
      <div className="space-y-6">
        <KnowledgeBaseHeader
          viewType={viewType}
          onViewTypeChange={onViewTypeChange}
          onAddBase={handleAddBase}
          isAddingBase={isAddingBase}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            border: '1px solid var(--border-color)'
          }}
        >
          <KnowledgeBaseTable
            bases={currentBases}
            onOpenViewModal={handleOpenViewModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            isDeletingBase={deleteModal.base?.uid || null}
          />
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <ModalDeleteBase
        key={deleteModal.base?.uid}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        base={deleteModal.base}
      />
    </>
  );
};
