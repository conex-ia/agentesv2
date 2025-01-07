import React from 'react';
import { motion } from 'framer-motion';

interface ComparisonCardProps {
  title: string;
  description: string;
  imageUrl: string;
  isModern?: boolean;
  direction: 'left' | 'right';
}

const ComparisonCard = ({ title, description, imageUrl, isModern = false, direction }: ComparisonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="w-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 backdrop-blur-sm h-full flex flex-col border bg-[#1F2937]/30 border-gray-800"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-xl sm:text-2xl font-bold mb-4 text-white"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm sm:text-base text-gray-300"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ComparisonCard;