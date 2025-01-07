import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CheckCircle2 } from 'lucide-react';

interface ModalDeleteTreinamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  trainingName: string;
  trainingOrigin?: string;
  trainingBase?: string;
}

const ModalDeleteTreinamento = ({
  isOpen,
  onClose,
  onConfirm,
  trainingName,
  trainingOrigin = 'Não informada',
  trainingBase = 'Aguardando'
}: ModalDeleteTreinamentoProps) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleConfirm = async () => {
    try {
      const result = await onConfirm();
      if (result.success) {
        setIsDeleted(true);
      }
    } catch (error) {
      console.error('Erro ao excluir treinamento:', error);
    }
  };

  const handleClose = () => {
    setIsDeleted(false);
    onClose();
  };

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
                      {isDeleted ? 'Treinamento Excluído' : 'Excluir Treinamento'}
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
                <div className="flex flex-col items-center">
                  <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <div>
                        <span className="text-sm text-gray-400">Vinculado a base:</span>
                        <p className="text-white">{trainingBase}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Origem:</span>
                        <p className="text-white">{trainingOrigin}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Resumo:</span>
                        <p className="text-white">{trainingName}</p>
                      </div>
                    </div>
                  </div>

                  {isDeleted ? (
                    <p className="text-sm text-emerald-400 text-center mb-6">
                      Treinamento excluído com sucesso!
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 text-center mb-6">
                      Esta ação é irreversível! Tem certeza que deseja excluir este treinamento?
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
                          className="flex-1 py-2.5 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleConfirm}
                          className="flex-1 py-2.5 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Excluir
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

export default ModalDeleteTreinamento;
