import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';
import useAuth from '../../../stores/useAuth';
import { Projeto } from './ProjetosGrid';

interface EditProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (uid: string, nome: string) => Promise<Projeto[]>;
  projeto: Projeto;
}

const EditProjetoModal = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  projeto 
}: EditProjetoModalProps) => {
  const [nome, setNome] = useState(projeto.nome || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useAuth();

  const handleConfirm = async () => {
    if (!nome.trim()) {
      setError('O nome do projeto é obrigatório');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(projeto.uid, nome);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar projeto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Building size={24} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">Editar Projeto</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nome do Projeto *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProjetoModal;
