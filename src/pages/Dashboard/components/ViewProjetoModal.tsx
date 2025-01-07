import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen } from 'lucide-react';
import { Projeto } from './ProjetosGrid';
import { useKnowledgeBaseNames } from '../../../hooks/useKnowledgeBaseNames';

interface ViewProjetoModalProps {
  isOpen: boolean;
  projeto: Projeto | null;
  onClose: () => void;
}

const ViewProjetoModal: React.FC<ViewProjetoModalProps> = ({
  isOpen,
  projeto,
  onClose
}) => {
  const { baseNames, loading } = useKnowledgeBaseNames(projeto?.bases || []);

  if (!projeto) return null;

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <FolderOpen size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Detalhes do Projeto "{projeto.nome}"
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Informações</h4>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <div>
                      <span className="text-gray-400">Nome</span>
                      <p className="text-white">{projeto.nome}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Data de Criação</span>
                      <p className="text-white">{formatDate(projeto.created_at)}</p>
                    </div>

                    <div>
                      <span className="text-gray-400">Bases de Conhecimento</span>
                      {loading ? (
                        <div className="mt-2 animate-pulse">
                          <div className="h-10 bg-gray-700 rounded-lg"></div>
                        </div>
                      ) : projeto.bases && projeto.bases.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {projeto.bases.map((baseId) => (
                            <div 
                              key={baseId}
                              className="bg-gray-700 p-3 rounded-lg text-gray-300"
                            >
                              {baseNames[baseId] || 'Base não encontrada'}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-300 mt-2">Sem base de conhecimento vinculada</p>
                      )}
                    </div>

                    {projeto.treinamentos && (
                      <div>
                        <span className="text-gray-400">Treinamentos</span>
                        <div className="mt-2">
                          <div className="bg-gray-700 p-3 rounded-lg text-gray-300">
                            Treinamento vinculado
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full mt-6 py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                           transition-colors font-medium"
                >
                  Fechar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewProjetoModal;
