import React, { useEffect } from 'react';
import { useUser } from '../../../hooks/useUser';
import { useProjetos } from '../../../hooks/useProjetos';
import useAuth from '../../../stores/useAuth';
import { useProject } from '../../../contexts/ProjectContext';
import ThemeToggle from '../../../components/ThemeToggle';
import { ChevronDown, FolderOpen } from 'lucide-react';

interface UserData {
  user_nome?: string;
}

type RouteType = 'dashboard' | 'projetos' | 'whatsapp' | 'treinamentos';

interface WelcomeHeaderProps {
  route?: RouteType;
}

const getWelcomeMessage = (route: RouteType) => {
  switch (route) {
    case 'projetos':
      return 'aos seus Projetos';
    case 'whatsapp':
      return 'ao WhatsApp';
    case 'treinamentos':
      return 'aos seus Treinamentos';
    default:
      return 'ao seu Dashboard';
  }
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ route = 'dashboard' }) => {
  const { userData } = useUser();
  const { empresaUid } = useAuth();
  const { projetos } = useProjetos(empresaUid);
  const { selectedProject, setSelectedProject } = useProject();
  const userName = (userData as UserData)?.user_nome || '';

  // Encontra o nome do projeto selecionado
  const selectedProjectName = selectedProject !== 'all' 
    ? projetos?.find(p => p.uid === selectedProject)?.nome 
    : null;

  // Valida se o projeto salvo ainda existe na lista
  useEffect(() => {
    console.log('Validando projeto no WelcomeHeader:', {
      selectedProject,
      projetos: projetos?.map(p => ({ uid: p.uid, nome: p.nome }))
    });

    if (selectedProject !== 'all' && projetos?.length) {
      const projetoExiste = projetos.some(projeto => projeto.uid === selectedProject);
      console.log('Projeto existe?', projetoExiste);
      
      if (!projetoExiste) {
        console.log('Projeto não encontrado, resetando para all');
        setSelectedProject('all');
      }
    }
  }, [projetos, selectedProject, setSelectedProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    console.log('Mudando projeto para:', newValue);
    setSelectedProject(newValue);
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
                Bem-vindo(a) {getWelcomeMessage(route)}
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
            {/* Label Fixo de Projeto */}
            <div className="flex items-center gap-2">
              <FolderOpen 
                size={20} 
                style={{ color: 'var(--text-secondary)' }}
              />
              <span 
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Projeto:
              </span>
            </div>
            
            {/* Select de Projetos */}
            <div className="relative flex-1">
              <select
                value={selectedProject}
                onChange={handleProjectChange}
                className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">Todos os Projetos</option>
                {projetos?.map((projeto) => (
                  <option key={projeto.uid} value={projeto.uid}>
                    {projeto.nome}
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

export default WelcomeHeader; 