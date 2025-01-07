import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-semibold mb-4 text-emerald-500"
      >
        Tire sua empresa da era da pedra
      </motion.p>
      <h2 
        className="text-4xl md:text-5xl font-bold mb-6 text-white"
      >
        Dos Chatbots Frustrantes aos{' '}
        <span className="text-emerald-500">Assistentes Inteligentes</span>
      </h2>
      <p 
        className="text-xl max-w-3xl mx-auto text-gray-300"
      >
        Entenda como os assistentes com IA estão transformando a forma de atender clientes ao compreenderem contexto e necessidades.
      </p>
    </motion.div>
  );
};

export default SectionHeader;