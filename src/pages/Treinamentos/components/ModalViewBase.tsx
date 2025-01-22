import React from 'react';
import { Database, X, Eye } from 'lucide-react';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { Dialog } from '@headlessui/react';
import { formatDate } from '../../../utils/formatDate';
import { useProjetos } from '../../../hooks/useProjetos';
import useAuth from '../../../stores/useAuth';

const S3_BASE_URL = 'https://s3.conexcondo.com.br/conexia-v2/';

interface ModalViewBaseProps {
  isOpen: boolean;
  onClose: () => void;
  base: KnowledgeBase | null;
}

const ModalViewBase: React.FC<ModalViewBaseProps> = ({
  isOpen,
  onClose,
  base
}) => {
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetos(empresaUid);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

  const handleViewContent = (content: string) => {
    const url = `${S3_BASE_URL}${content}`;
    window.open(url, '_blank');
  };

  // Função para verificar se deve mostrar o botão de visualizar
  const shouldShowViewButton = (content: string) => {
    return content !== 'Chat laboratório';
  };

  if (!base) return null;

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
            <Dialog.Panel className="w-full max-w-2xl overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {/* Header */}
              <div className="border-b border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: 'var(--status-success-bg)' }}
                    >
                      <Database className="h-5 w-5 text-emerald-500" />
                    </div>
                    <Dialog.Title
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Detalhes da Base
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
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
                <div className="flex flex-col">
                  <div className="mb-6 rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nome</span>
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                          {base.nome ? base.nome.split('_')[0] : '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Projeto</span>
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>
                          {projetosLoading ? (
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-700/50"></div>
                          ) : (
                            base.projeto ? projetosMap[base.projeto]?.nome || 'Projeto não encontrado' : '-'
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Treinamentos</span>
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{base.treinamentos_qtd || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Criada em</span>
                        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>{formatDate(base.created_at)}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conteúdos</span>
                      {(!base.treinamentos || base.treinamentos.length === 0) ? (
                        <p className="mt-2 text-sm text-gray-500">Nenhum conteúdo adicionado</p>
                      ) : (
                        <div className="mt-3 max-h-48 space-y-2 overflow-y-auto custom-scrollbar">
                          {base.treinamentos.map((treinamento, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3 text-sm"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              <span className="line-clamp-1">{treinamento}</span>
                              {shouldShowViewButton(treinamento) && (
                                <button
                                  onClick={() => handleViewContent(treinamento)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                                  style={{ backgroundColor: 'rgba(0, 209, 157, 0.1)' }}
                                >
                                  <Eye className="h-4 w-4" style={{ color: '#00D19D' }} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

export default ModalViewBase;
