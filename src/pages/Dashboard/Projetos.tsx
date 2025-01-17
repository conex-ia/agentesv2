import React, { useState, useEffect } from 'react';
import { Projeto } from './components/ProjetosGrid';
import { motion } from 'framer-motion';
import { useProjetos } from '../../hooks/useProjetos';
import useAuth from '../../stores/useAuth';
import { supabase } from '../../lib/supabase';
import ProjetosGrid from './components/ProjetosGrid';
import AddProjetoModal from './components/AddProjetoModal';
import ProjetosHeader from './components/ProjetosHeader';
import WelcomeHeader from './components/WelcomeHeader';

const Projetos = () => {
  const { empresaUid } = useAuth();
  const { projetos, loading } = useProjetos(empresaUid);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'table'>(() => {
    const savedViewType = localStorage.getItem('projetosViewType');
    return (savedViewType as 'grid' | 'table') || 'grid';
  });

  useEffect(() => {
    localStorage.setItem('projetosViewType', viewType);
  }, [viewType]);

  const handleAddProjeto = async (nome: string): Promise<void> => {
    console.log('Empresa UID:', empresaUid);
    
    if (!empresaUid) {
      console.error('Empresa UID não encontrado');
      throw new Error('Empresa UID não encontrado');
    }

    // Verificar se já existe um projeto com o mesmo nome
    const projetoExistente = projetos?.find(
      projeto => projeto.nome.toLowerCase() === nome.toLowerCase()
    );

    if (projetoExistente) {
      throw new Error('Já existe um projeto com este nome. Por favor, escolha outro nome.');
    }

    const projetoData = {
      empresa: empresaUid,
      nome
    };

    console.log('Enviando dados do projeto:', projetoData);

    try {
      const { data, error } = await supabase
        .from('conex_projetos')
        .insert(projetoData)
        .select();

      if (error) {
        console.error('Erro ao adicionar projeto:', error);
        throw new Error(error.message);
      }

      console.log('Projeto adicionado com sucesso:', data);
    } catch (error) {
      console.error('Erro completo:', error);
      throw error; // Propaga o erro para ser tratado no modal
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 pb-4 sm:pb-6"
      >
        <div className="max-w-[1370px] mx-auto">
          <div 
            className="rounded-lg p-8 shadow-lg"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div style={{ color: 'var(--text-primary)' }}>Carregando projetos...</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader route="projetos" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4 pb-4 pt-4 sm:pb-6"
      >
        <div className="max-w-[1370px] mx-auto space-y-6">
          <ProjetosHeader 
            onAddProjeto={() => setIsAddModalOpen(true)} 
            viewType={viewType}
            onViewTypeChange={setViewType}
          />
          
          <ProjetosGrid
            projetos={projetos}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            viewType={viewType}
          />
        </div>
      </motion.div>

      <AddProjetoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddProjeto}
      />
    </div>
  );
};

export default Projetos;
