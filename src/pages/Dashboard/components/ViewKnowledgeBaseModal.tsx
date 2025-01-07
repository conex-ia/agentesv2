import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Eye, Trash2 } from 'lucide-react';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';

interface ViewKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  base: KnowledgeBase | null;
}

const ViewKnowledgeBaseModal = ({
  isOpen,
  onClose,
  base
}: ViewKnowledgeBaseModalProps) => {
  if (!base) return null;

  const handleViewContent = (content: string) => {
    const url = `https://s3.conexcondo.com.br/conexia-v2/${content}`;
    window.open(url, '_blank');
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
                    <Database size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Resumo da Base "{base.nome}"
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
                  <h4 className="text-lg font-semibold text-white mb-4">Conteúdos</h4>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {base.treinamentos && base.treinamentos.length > 0 ? (
                      <div className="space-y-2">
                        {base.treinamentos.map((treinamento, index) => (
                          <div 
                            key={index}
                            className="bg-gray-700 p-3 rounded-lg text-gray-300 flex items-center justify-between"
                          >
                            <span className="flex-1 mr-4">{treinamento}</span>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <button 
                                  onClick={() => handleViewContent(treinamento)}
                                  className="w-12 h-12 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                  <Eye size={24} className="text-emerald-500" />
                                </button>
                                <span className="text-[9px] text-gray-400 mt-1">
                                  visualizar
                                </span>
                              </div>
                              <div className="flex flex-col items-center">
                                <button 
                                  className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                  <Trash2 size={24} className="text-red-500" />
                                </button>
                                <span className="text-[9px] text-gray-400 mt-1">
                                  excluir
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        Nenhum conteúdo disponível
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full mt-6 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
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

export default ViewKnowledgeBaseModal;