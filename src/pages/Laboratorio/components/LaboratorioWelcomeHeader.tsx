import React from 'react';
import { useUser } from '../../../hooks/useUser';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';
import useAuth from '../../../stores/useAuth';
import { useKnowledgeBase } from '../../../contexts/KnowledgeBaseContext';
import ThemeToggle from '../../../components/ThemeToggle';
import { ChevronDown, BookOpen } from 'lucide-react';

const LaboratorioWelcomeHeader: React.FC = () => {
  const { userData } = useUser();
  const { empresaUid } = useAuth();
  const { bases } = useKnowledgeBases();
  const { selectedKnowledgeBase, setSelectedKnowledgeBase } = useKnowledgeBase();
  const userName = userData?.user_nome || '';

  // Encontra o nome da base selecionada
  const selectedBaseName = selectedKnowledgeBase !== 'all' 
    ? bases?.find(b => b.uid === selectedKnowledgeBase)?.nome 
    : null;

  const handleBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedKnowledgeBase(newValue);
  };

  // Função para formatar o nome da base
  const formatBaseName = (nome: string | null) => {
    if (!nome) return '';
    return nome.split('_')[0];
  };

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-[1370px] mx-auto space-y-4">
        {/* Header com Boas-vindas */}
        <div className="rounded-lg" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
          <div className="flex justify-between items-center p-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Olá, {userName}!
              </h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                Bem-vindo(a) ao Laboratório
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div 
          className="rounded-lg p-4"
          style={{ backgroundColor: 'var(--sidebar-bg)' }}
        >
          <div className="flex items-center gap-4">
            {/* Label Fixo de Base de Conhecimento */}
            <div className="flex items-center gap-2">
              <BookOpen 
                size={20} 
                style={{ color: 'var(--text-secondary)' }}
              />
              <span 
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Base de Conhecimento:
              </span>
            </div>
            
            {/* Select de Bases */}
            <div className="relative flex-1">
              <select
                value={selectedKnowledgeBase}
                onChange={handleBaseChange}
                className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">Todas as Bases</option>
                {bases?.map((base) => (
                  <option key={base.uid} value={base.uid}>
                    {formatBaseName(base.nome)}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown 
                  size={20} 
                  style={{ color: 'var(--text-secondary)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratorioWelcomeHeader;
