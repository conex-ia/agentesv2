import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus } from 'lucide-react';

interface AddProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (nome: string) => Promise<void>;
}

const AddProjetoModal: React.FC<AddProjetoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [nome, setNome] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onAdd(nome);
      setNome('');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro ao adicionar o projeto');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="w-full max-w-lg bg-[var(--bg-primary)] rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FolderPlus className="text-emerald-500" size={24} />
                  Adicionar Novo Projeto
                </h2>
                <button 
                  onClick={onClose}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label 
                  htmlFor="nome" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-shadow"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Digite o nome do projeto"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !nome.trim()}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: nome.trim() && !isLoading ? 'rgb(16 185 129)' : 'var(--bg-secondary)',
                  }}
                >
                  <FolderPlus size={16} />
                  {isLoading ? 'Adicionando...' : 'Adicionar Projeto'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProjetoModal;
