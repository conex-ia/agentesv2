import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Trash2, PauseCircle } from 'lucide-react';

const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  title: string;
  assistantName: string;
  assistantImage?: string | null;
  actionType: 'pause' | 'delete';
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  assistantName,
  assistantImage,
  actionType,
}: ConfirmationModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setResult(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const result = await onConfirm();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao processar sua solicitação. Por favor, tente novamente.'
      });
    }
    setIsProcessing(false);
  };

  const handleClose = () => {
    setIsProcessing(false);
    setResult(null);
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
            onClick={result ? handleClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-[1001] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#1A1D24] rounded-xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-[#1F232B] px-6 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                    {actionType === 'delete' && (
                      <Trash2 
                        size={24} 
                        className="text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" 
                      />
                    )}
                    {actionType === 'pause' && (
                      <PauseCircle 
                        size={24} 
                        className="text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" 
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                    <p className="text-sm text-gray-400">{assistantName}</p>
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
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">{assistantName}</h3>
                    <p className="text-gray-400 mb-6">{result.message}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Fechar
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
                      <img
                        src={assistantImage || DEFAULT_PROFILE_IMAGE}
                        alt={assistantName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className={`text-sm text-center mb-6 ${
                      actionType === 'delete' 
                        ? 'text-red-400'
                        : 'text-emerald-400'
                    }`}>
                      {actionType === 'delete' 
                        ? 'Esta ação é irreversível!'
                        : 'Esta ação é reversível. Você pode reativar o assistente a qualquer momento.'
                      }
                    </p>

                    <div className="flex gap-3 w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="flex-1 py-2.5 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          actionType === 'delete' 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}
                      >
                        {isProcessing ? 'Processando...' : 'Continuar'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
