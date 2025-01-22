import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useProjetosSelect } from '../../../hooks/useProjetosSelect';
import useAuth from '../../../stores/useAuth';
import { Database, Loader2 } from 'lucide-react';

interface ModalAddBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, projectId: string) => Promise<string>;
}

const ModalAddBase: React.FC<ModalAddBaseProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetosSelect(empresaUid);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedProject('');
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    // Validate fields
    if (!name.trim()) {
      setError('O nome da base é obrigatório');
      return;
    }
    if (!selectedProject) {
      setError('Selecione um projeto');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onConfirm(name.trim(), selectedProject);
      setName('');
      setSelectedProject('');
      onClose();
    } catch (error) {
      console.error('Error adding base:', error);
      setError('Erro ao adicionar base. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

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
              className="w-full max-w-md overflow-hidden rounded-lg"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              {/* Header */}
              <div className="p-6">
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
                      Nova Base de Conhecimento
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100/10"
                    style={{ color: 'var(--text-secondary)' }}
                    disabled={isLoading}
                  >
                    <span className="sr-only">Fechar</span>
                    ×
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-200/10" />

              {/* Form */}
              <div className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Nome da Base
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                    placeholder="Digite o nome da base"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="project"
                    className="mb-1.5 block text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Projeto
                  </label>
                  <select
                    id="project"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2.5 [&>option]:bg-gray-900 [&>option]:text-gray-100"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-primary)'
                    }}
                    disabled={isLoading || projetosLoading}
                  >
                    <option value="" className="bg-gray-900">Selecione um projeto</option>
                    {projetosLoading ? (
                      <option value="" disabled className="bg-gray-900">Carregando projetos...</option>
                    ) : projetos.length === 0 ? (
                      <option value="" disabled className="bg-gray-900">Nenhum projeto encontrado</option>
                    ) : (
                      projetos.map((projeto) => (
                        <option key={projeto.uid} value={projeto.uid} className="bg-gray-900">
                          {projeto.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {error && (
                  <div
                    className="rounded-lg p-3 text-sm"
                    style={{
                      backgroundColor: 'var(--error-bg)',
                      color: 'var(--error-color)'
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-200/10" />

              {/* Actions */}
              <div className="flex justify-end gap-3 p-6">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-gray-500/20 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-500/30"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/30"
                  disabled={isLoading || projetosLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    'Adicionar Base'
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

export default ModalAddBase;
