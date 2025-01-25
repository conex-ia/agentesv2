import React from 'react';
import WelcomeHeader from '../../components/WelcomeHeader';

const Produtos: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader route="produtos" />
      
      <div className="w-full px-6 pb-6">
        <div className="max-w-[1370px] mx-auto">
          {/* Conteúdo da página será adicionado aqui */}
        </div>
      </div>
    </div>
  );
};

export default Produtos;
