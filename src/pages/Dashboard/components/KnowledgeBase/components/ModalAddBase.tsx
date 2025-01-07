import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database } from 'lucide-react';
import useAuth from '../../../../../stores/useAuth';
import { supabase } from '../../../../../lib/supabase';

interface Projeto {
  uid: string;
  nome: string;
  empresa: string;
  ativo: boolean;
}

interface ModalAddBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, projectId: string) => Promise<string>;
}

export const ModalAddBase: React.FC<ModalAddBaseProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [name, setName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { empresaUid } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedProject('');
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchProjetos = async () => {
      if (!empresaUid) {
        console.log('Empresa UID não encontrado');
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando projetos para empresa:', empresaUid);
        
        const { data, error } = await supabase
          .from('conex_projetos')
          .select('uid, nome, empresa, ativo')
          .eq('empresa', empresaUid)
          .eq('ativo', true);

        if (error) {
          console.error('Erro na query:', error);
          throw error;
        }

        console.log('Projetos encontrados:', data);
        setProjetos(data || []);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, [empresaUid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      console.error('Nome não fornecido');
      return;
    }

    if (!selectedProject) {
      console.error('Projeto não selecionado');
      return;
    }

    setIsAdding(true);

    try {
      const projectUid = selectedProject.trim();
      
      console.log('Projeto selecionado:', {
        uid: projectUid
      });

      const result = await onConfirm(name.trim(), projectUid);
      console.log('Workflow iniciado:', result);
      setName('');
      setSelectedProject('');
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar base no modal:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="relative w-full max-w-md bg-gray-800 rounded-xl shadow-xl">
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Database size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Adicionar Base
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Projeto
                      </label>
                      <div className="relative">
                        <select
                          value={selectedProject}
                          onChange={(e) => {
                            console.log('Projeto selecionado no dropdown:', e.target.value);
                            setSelectedProject(e.target.value);
                          }}
                          className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block p-2.5 pr-8"
                          disabled={isAdding || loading}
                        >
                          <option value="">Selecione um projeto</option>
                          {projetos?.map((projeto) => (
                            <option key={projeto.uid} value={projeto.uid}>
                              {projeto.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome da Base
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite o nome da base"
                        className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5"
                        disabled={isAdding}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      disabled={isAdding}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding || loading}
                      className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? 'Adicionando...' : 'Adicionar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
