import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, FolderOpen } from 'lucide-react';
import { Projeto } from './ProjetosGrid';

interface ViewProjetoModalProps {
  isOpen: boolean;
  projeto: Projeto | null;
  onClose: () => void;
}

const ViewProjetoModal: React.FC<ViewProjetoModalProps> = ({
  isOpen,
  projeto,
  onClose,
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
                  Detalhes do Projeto
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3
                    className="text-lg font-medium mb-2 flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <FolderOpen className="w-5 h-5 text-emerald-500" />
                    {projeto.nome}
                  </h3>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Data de Criação:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-5 h-5 text-emerald-500" />
                    <span style={{ color: 'var(--text-primary)' }}>
                      {new Date(projeto.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Treinamentos:</span>
                  <div className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {projeto.treinamentos || 0}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewProjetoModal;
