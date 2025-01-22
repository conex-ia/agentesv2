import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Loader2 } from 'lucide-react';
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
  if (!projeto) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <Dialog 
          as="div" 
          className="relative z-10"
          onClose={onClose}
          open={isOpen}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              className="relative rounded-lg p-8 max-w-md w-full mx-auto"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <Dialog.Title
                  className="text-lg font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Excluir Projeto
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p style={{ color: 'var(--text-primary)' }}>
                  Tem certeza que deseja excluir o projeto <strong>{projeto.nome}</strong>?
                </p>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-md border"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    'Excluir'
                  )}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteProjetoModal;
