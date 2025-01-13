import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../stores/useAuth';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { userUid } = useAuth();

  // Se o usuário já estiver logado, redireciona para o dashboard
  React.useEffect(() => {
    if (userUid) {
      navigate('/dashboard');
    }
  }, [userUid, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Bem-vindo ao Conexia
        </h1>
        <p className="text-xl sm:text-2xl mb-12 text-gray-300">
          Sua plataforma inteligente para gestão de conhecimento e treinamento
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 text-lg font-medium rounded-lg border border-white hover:bg-white hover:text-gray-900 transition-colors"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
