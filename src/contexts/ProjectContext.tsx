import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProjetosGlobal } from '../hooks/useProjetosGlobal';
import useAuth from '../stores/useAuth';

interface ProjectContextType {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
}

const STORAGE_KEY = 'dashboardSelectedProject';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { empresaUid } = useAuth();
  const { projetos } = useProjetosGlobal(empresaUid);
  const [selectedProject, setSelectedProject] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Valor inicial do localStorage:', saved);
      return saved || 'all';
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return 'all';
    }
  });

  // Validar se o projeto selecionado ainda existe
  useEffect(() => {
    if (selectedProject !== 'all' && projetos.length > 0) {
      const projetoExiste = projetos.some(p => p.uid === selectedProject);
      if (!projetoExiste) {
        console.log('Projeto selecionado não existe mais, resetando para "all"');
        handleSetSelectedProject('all');
      }
    }
  }, [projetos, selectedProject]);

  useEffect(() => {
    console.log('Estado atual do selectedProject:', selectedProject);
    console.log('Valor atual no localStorage:', localStorage.getItem(STORAGE_KEY));
  }, [selectedProject]);

  const handleSetSelectedProject = (project: string) => {
    console.log('Alterando projeto para:', project);
    try {
      localStorage.setItem(STORAGE_KEY, project);
      setSelectedProject(project);
      console.log('Projeto salvo no localStorage:', localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      selectedProject, 
      setSelectedProject: handleSetSelectedProject 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};