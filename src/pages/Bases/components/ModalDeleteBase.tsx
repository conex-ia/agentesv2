import React, { useState } from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { Dialog } from '@headlessui/react';
import { useProjetos } from '../../../hooks/useProjetos';
import useAuth from '../../../stores/useAuth';

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
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetos(empresaUid);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

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

  // Função para formatar o nome da base
  const formatBaseName = (nome: string | null) => {
    if (!nome) return '-';
    return nome.split('_')[0];
  };

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
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {/* Header */}
              <div className="border-b border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/50">
                      {isDeleted ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <Trash2 className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <Dialog.Title
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {isDeleted ? 'Base Excluída' : 'Excluir Base de Conhecimento'}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100/10"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="sr-only">Fechar</span>
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {isDeleted ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(0, 209, 157, 0.1)' }}>
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-emerald-400">
                        Base de conhecimento excluída com sucesso!
                      </p>
                      <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
                        A base <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{formatBaseName(base.nome)}</span> foi excluída permanentemente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                        Tem certeza que deseja excluir esta base de conhecimento?
                      </p>
                      <p className="mt-2 text-sm text-red-400">
                        Ao clicar em EXCLUIR BASE a tabela e seus treinamentos relacionados serão excluídos. Esta ação é irreversível!
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-800/50 p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nome</span>
                          <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                            {formatBaseName(base.nome)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Projeto</span>
                          <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                            {projetosLoading ? (
                              <div className="h-5 w-32 animate-pulse rounded bg-gray-700/50"></div>
                            ) : (
                              base.projeto ? projetosMap[base.projeto]?.nome || 'Projeto não encontrado' : '-'
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Treinamentos</span>
                          <p className="text-base" style={{ color: 'var(--text-primary)' }}>{base.treinamentos_qtd || 0}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isDeleted ? (
                <div className="border-t border-gray-700/50 p-6">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleClose}
                      className="rounded-lg bg-gray-500/20 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-500/30"
                      disabled={isDeleting}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir Base'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-700/50 p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={handleClose}
                      className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ModalDeleteBase;
