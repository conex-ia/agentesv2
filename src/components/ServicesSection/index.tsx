import React from 'react';
import Background from './Background';
import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      title: 'Atendimento Inteligente',
      description: 'Assistentes virtuais que entendem o contexto e fornecem respostas precisas e personalizadas.',
      icon: 'MessageSquare',
    },
    {
      title: 'Análise de Documentos',
      description: 'Processamento e análise automática de documentos com compreensão avançada do conteúdo.',
      icon: 'FileText',
    },
    {
      title: 'Integração Multicanal',
      description: 'Comunicação integrada através de diversos canais como WhatsApp, e-mail e chat.',
      icon: 'Share2',
    },
    {
      title: 'Personalização Avançada',
      description: 'Treine seu assistente com suas próprias bases de conhecimento e regras de negócio.',
      icon: 'Settings',
    },
    {
      title: 'Análise de Sentimentos',
      description: 'Compreensão do tom e emoções nas interações para respostas mais empáticas.',
      icon: 'Heart',
    },
    {
      title: 'Relatórios Detalhados',
      description: 'Insights valiosos sobre interações, satisfação e áreas de melhoria.',
      icon: 'BarChart2',
    },
  ];

  return (
    <section 
      id="servicos" 
      className="relative py-24 overflow-hidden bg-[#111827]"
    >
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;