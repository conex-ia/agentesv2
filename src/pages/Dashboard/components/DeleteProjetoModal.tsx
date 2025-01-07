import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Projeto } from './ProjetosGrid';
import { supabase } from '../../../lib/supabase';
import { useKnowledgeBaseNames } from '../../../hooks/useKnowledgeBaseNames';

interface DeleteProjetoModalProps {
  isOpen: boolean;
  projeto: Projeto | null;
  onClose: () => void;
}

const DeleteProjetoModal = ({
  isOpen,
  projeto,
  onClose,
}: DeleteProjetoModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { baseNames, loading } = useKnowledgeBaseNames(projeto?.bases || []);

  const handleDelete = async () => {
    if (!projeto) return;
    
    try {
      setIsDeleting(true);
      
      // Primeiro faz o soft delete do projeto (update ativo = false)
      const { error: updateError } = await supabase
        .from('conex_projetos')
        .update({ ativo: false })
        .eq('uid', projeto.uid);

      if (updateError) throw updateError;

      // Se o projeto tem bases associadas
      if (projeto.bases && projeto.bases.length > 0) {
        // Faz o soft delete das bases (update ativa = false)
        const { error: basesUpdateError } = await supabase
          .from('conex-bases_t')
          .update({ ativa: false })
          .in('uid', projeto.bases);

        if (basesUpdateError) throw basesUpdateError;
      }

      // Aguarda 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Depois faz o hard delete do projeto
      const { error: deleteError } = await supabase
        .from('conex_projetos')
        .delete()
        .eq('uid', projeto.uid);

      if (deleteError) throw deleteError;

      // Se o projeto tem bases associadas
      if (projeto.bases && projeto.bases.length > 0) {
        // Faz o hard delete das bases
        const { error: basesDeleteError } = await supabase
          .from('conex-bases_t')
          .delete()
          .in('uid', projeto.bases);

        if (basesDeleteError) throw basesDeleteError;
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!projeto || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Excluir Projeto</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Informações</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400">Nome</span>
                      <p className="text-white">{projeto.nome}</p>
                    </div>

                    {projeto.bases && projeto.bases.length > 0 && (
                      <div>
                        <span className="text-gray-400">Bases de Conhecimento</span>
                        <div className="mt-2 p-3 bg-red-500/10 rounded-lg">
                          <p className="text-red-500 font-medium mb-3">
                            Ao excluir este projeto, todas as bases vinculadas e seus treinamentos serão excluídos também
                          </p>
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-10 bg-gray-700/50 rounded-lg"></div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {projeto.bases.map((baseId) => (
                                <div 
                                  key={baseId}
                                  className="bg-gray-700/50 p-3 rounded-lg text-white"
                                >
                                  {baseNames[baseId] || 'Base não encontrada'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteProjetoModal;
