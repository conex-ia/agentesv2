import React from 'react';
import { Beaker } from 'lucide-react';
import LaboratorioWelcomeHeader from './components/LaboratorioWelcomeHeader';
import ChatContainer from './components/Chat/ChatContainer';
import useAuth from '../../stores/useAuth';
import { useUser } from '../../hooks/useUser';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';

// Atualizando o componente para incluir o WelcomeHeader corretamente
const Laboratorio = () => {
  const { userUid, empresaUid } = useAuth();
  const { loading: loadingUser } = useUser();
  const { loading: loadingBases } = useKnowledgeBases();

  const isLoading = loadingUser || loadingBases;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center" style={{ color: 'var(--text-primary)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        </div>
      ) : (
        <>
          <LaboratorioWelcomeHeader />
          <div className="w-full px-6">
            <div className="max-w-[1370px] mx-auto">
              <div className="flex flex-col gap-6">
                <ChatContainer />
                {/* Área reservada para futuros componentes */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Laboratorio;
