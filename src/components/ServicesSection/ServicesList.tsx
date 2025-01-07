import React from 'react';
import { Bot, Brain, Sparkles, Zap } from 'lucide-react';
import ServiceCard from './ServiceCard';

const services = [
  {
    icon: <Bot size={32} />,
    title: 'Assistentes Personalizados',
    description: 'Crie assistentes virtuais únicos e adaptados às necessidades específicas do seu negócio.'
  },
  {
    icon: <Brain size={32} />,
    title: 'IA Avançada',
    description: 'Utilize algoritmos de última geração para automatizar e otimizar seus processos.'
  },
  {
    icon: <Sparkles size={32} />,
    title: 'Experiência Intuitiva',
    description: 'Interface amigável e natural para interação com seus assistentes virtuais.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Alta Performance',
    description: 'Respostas rápidas e precisas, mantendo a qualidade e eficiência do serviço.'
  }
];

const ServicesList = () => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-6xl mx-auto"
      style={{ color: 'var(--text-primary)' }}
    >
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          index={index}
          icon={service.icon}
          title={service.title}
          description={service.description}
        />
      ))}
    </div>
  );
};

export default ServicesList;