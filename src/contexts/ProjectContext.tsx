import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProjectContextType {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
}

const STORAGE_KEY = 'dashboardSelectedProject';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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