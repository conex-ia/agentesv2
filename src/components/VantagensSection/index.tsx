import React from 'react';
import Background from './Background';
import SectionHeader from './SectionHeader';
import ComparisonCard from './ComparisonCard';

const VantagensSection = () => {
  const comparisons = [
    {
      title: 'Chatbots Frustrantes',
      description: 'Guiados por fluxos rígidos e incapazes de entender o contexto, esses chatbots deixavam clientes frustrados e sem respostas claras. Limitados a respostas pré-definidas, raramente atendiam às necessidades reais.',
      imageUrl: 'https://s3.conexcondo.com.br/fmg/chatbot-frustrante-flavio-marcelo-guardia.png',
      isModern: false,
      direction: 'left' as const,
    },
    {
      title: 'Assistentes com IA',
      description: 'Capazes de entender o contexto, interpretar áudio, imagens, documentos e muito mais, os assistentes com IA oferecem respostas precisas, personalizadas e eficientes. Uma experiência realmente inteligente e satisfatória.',
      imageUrl: 'https://s3.conexcondo.com.br/fmg/assistente-com-ia-flavio-marcelo-guardia.jpg',
      isModern: true,
      direction: 'right' as const,
    },
  ];

  return (
    <section 
      id="vantagens" 
      className="relative py-24 overflow-hidden bg-[#111827]"
    >
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {comparisons.map((comparison, index) => (
            <div key={index} className="flex justify-center">
              <div className="w-full max-w-[500px]">
                <ComparisonCard {...comparison} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VantagensSection;