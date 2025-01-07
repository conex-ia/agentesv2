import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CheckCircle2 } from 'lucide-react';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';
import { Modal } from '../../../../../components/Modal';

interface ModalDeleteBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  base: KnowledgeBase | null;
}

const ModalDeleteBase: React.FC<ModalDeleteBaseProps> = ({
  isOpen,
  onClose,
  onConfirm,
  base
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!base) return;
    
    setIsDeleting(true);
    const result = await onConfirm();
    setIsDeleting(false);
    
    if (result.success) {
      setIsDeleted(true);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset estado após fechar
    setTimeout(() => {
      setIsDeleted(false);
      setIsDeleting(false);
    }, 200);
  };

  if (!base) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[1001] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#1A1D24] rounded-xl shadow-xl overflow-hidden z-[1002]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-[#1F232B] px-6 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    {isDeleted ? (
                      <CheckCircle2 size={24} className="text-emerald-400" />
                    ) : (
                      <Trash2 size={24} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {isDeleted ? 'Base Excluída' : 'Excluir Base de Conhecimento'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col">
                  <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-sm text-gray-400">Nome da Base</span>
                        <p className="text-white">{base.nome}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Treinamentos</span>
                        <p className="text-white">{base.treinamentos_qtd || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Conteúdos</span>
                        {base.treinamentos && base.treinamentos.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {base.treinamentos.map((treinamento, index) => (
                              <div 
                                key={index}
                                className="bg-gray-700/50 p-2 rounded-lg text-white text-sm"
                              >
                                {treinamento}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white">Nenhum conteúdo adicionado</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isDeleted ? (
                    <p className="text-sm text-emerald-400 text-center mb-6">
                      Base excluída com sucesso!
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 text-left mb-6">
                      {base.treinamentos && base.treinamentos.length > 0 ? (
                        <>
                          Ao excluir a Base de Conhecimento, seu conteúdo também será excluído.<br />
                          Esta ação é irreversível! Tem certeza que deseja excluir esta Base?
                        </>
                      ) : (
                        'Esta ação é irreversível! Tem certeza que deseja excluir esta base?'
                      )}
                    </p>
                  )}

                  <div className="flex gap-3 w-full">
                    {isDeleted ? (
                      <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Fechar
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleClose}
                          disabled={isDeleting}
                          className="flex-1 py-2.5 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleConfirm}
                          disabled={isDeleting}
                          className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export { ModalDeleteBase }; 