import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        Recursos Avançados
      </h2>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto">
        Descubra como nossa plataforma pode transformar a comunicação da sua empresa 
        com recursos inovadores e inteligentes.
      </p>
    </motion.div>
  );
};

export default SectionHeader;