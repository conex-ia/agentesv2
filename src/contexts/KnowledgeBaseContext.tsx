import React, { createContext, useContext, useState, useEffect } from 'react';

interface KnowledgeBaseContextType {
  selectedKnowledgeBase: string;
  setSelectedKnowledgeBase: (base: string) => void;
}

const STORAGE_KEY = 'laboratorioSelectedBase';

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export const KnowledgeBaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Valor inicial da base no localStorage:', saved);
      return saved || 'all';
    } catch (error) {
      console.error('Erro ao ler base do localStorage:', error);
      return 'all';
    }
  });

  useEffect(() => {
    console.log('Estado atual da selectedKnowledgeBase:', selectedKnowledgeBase);
    console.log('Valor atual no localStorage:', localStorage.getItem(STORAGE_KEY));
  }, [selectedKnowledgeBase]);

  const handleSetSelectedKnowledgeBase = (base: string) => {
    console.log('Alterando base para:', base);
    try {
      localStorage.setItem(STORAGE_KEY, base);
      setSelectedKnowledgeBase(base);
      console.log('Base salva no localStorage:', localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      console.error('Erro ao salvar base:', error);
    }
  };

  return (
    <KnowledgeBaseContext.Provider value={{ 
      selectedKnowledgeBase, 
      setSelectedKnowledgeBase: handleSetSelectedKnowledgeBase 
    }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
};
