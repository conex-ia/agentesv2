import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, FolderOpen, Loader2, CheckCircle2 } from 'lucide-react';
import { Projeto } from './ProjetosGrid';

interface DeleteProjetoModalProps {
  isOpen: boolean;
  projeto: Projeto | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteProjetoModal: React.FC<DeleteProjetoModalProps> = ({
  isOpen,
  projeto,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStartedDeleting, setHasStartedDeleting] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Limpa os estados quando o modal abre
  useEffect(() => {
    if (isOpen) {
      console.log('[DeleteProjetoModal] Modal aberto, limpando estados');
      setIsCompleted(false);
      setHasStartedDeleting(false);
      setShowProgress(false);
    }
  }, [isOpen]);

  // Reset dos estados quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      console.log('[DeleteProjetoModal] Modal fechado, resetando estados');
      // Pequeno delay para a animação de saída
      const timeout = setTimeout(() => {
        setIsCompleted(false);
        setHasStartedDeleting(false);
        setShowProgress(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Atualiza para completed quando termina de deletar
  useEffect(() => {
    console.log('[DeleteProjetoModal] Estado mudou:', { isDeleting, hasStartedDeleting, isOpen, showProgress });
    
    if (isDeleting) {
      console.log('[DeleteProjetoModal] Iniciando deleção');
      setHasStartedDeleting(true);
      setShowProgress(true);
      setIsCompleted(false);
    } else if (!isDeleting && hasStartedDeleting && isOpen) {
      console.log('[DeleteProjetoModal] Deleção completada, mostrando sucesso em 500ms');
      // Mantém o progresso até mostrar completed
      const timeout = setTimeout(() => {
        console.log('[DeleteProjetoModal] Mostrando tela de sucesso');
        setIsCompleted(true);
        setShowProgress(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isDeleting, isOpen, hasStartedDeleting]);

  const handleDelete = () => {
    console.log('[DeleteProjetoModal] Iniciando processo de exclusão');
    setShowProgress(true);
    onConfirm();
  };

  const handleClose = () => {
    console.log('[DeleteProjetoModal] Fechando modal');
    onClose();
  };

  if (!projeto) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="w-full max-w-2xl bg-[var(--bg-primary)] rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  {isCompleted ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={24} />
                  )}
                  {isCompleted ? 'Projeto Excluído' : showProgress ? 'Excluindo Projeto' : 'Excluir Projeto'}
                </h2>
                <button 
                  onClick={handleClose}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {(showProgress || isCompleted) ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                    {showProgress && !isCompleted ? (
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {showProgress && !isCompleted ? 'Excluindo Projeto' : 'Exclusão Concluída'}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-center max-w-sm">
                    {showProgress && !isCompleted
                      ? 'Aguarde enquanto excluímos o projeto...'
                      : 'O projeto foi excluído com sucesso.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Alerta */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-500 text-sm">
                      Esta ação é irreversível e irá excluir este projeto
                    </p>
                  </div>

                  {/* Informações do Projeto */}
                  <div className="space-y-6">
                    {/* Nome */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Nome do Projeto</h4>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-emerald-500" />
                        <p style={{ color: 'var(--text-primary)' }}>{projeto.nome}</p>
                      </div>
                    </div>

                    {/* Data de Criação */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Data de Criação</h4>
                      <p style={{ color: 'var(--text-primary)' }}>
                        {new Date(projeto.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Treinamentos */}
                    <div>
                      <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Treinamentos</h4>
                      <p style={{ color: 'var(--text-primary)' }}>{projeto.treinamentos || '0'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer com borda suave e padding */}
            <div className="border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="px-6 py-4 flex justify-end gap-3">
                {!showProgress && !isCompleted && (
                  <>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <AlertTriangle size={16} />
                      Confirmar Exclusão
                    </button>
                  </>
                )}
                {isCompleted && (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteProjetoModal;
