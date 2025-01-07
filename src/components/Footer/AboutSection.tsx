import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const AboutSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Bot size={32} className="text-emerald-500" />
        <h2 className="text-2xl font-bold text-white">ConexIA</h2>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        Transforme sua comunicação com assistentes virtuais inteligentes. 
        Nossa plataforma oferece soluções avançadas de IA para automatizar 
        e melhorar o atendimento ao cliente.
      </p>
    </motion.div>
  );
};

export default AboutSection;