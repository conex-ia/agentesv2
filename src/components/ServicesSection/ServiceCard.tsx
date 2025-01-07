import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Share2, Settings, Heart, BarChart2 } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

const iconMap = {
  MessageSquare,
  FileText,
  Share2,
  Settings,
  Heart,
  BarChart2,
};

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  const Icon = iconMap[icon as keyof typeof iconMap];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/15 transition-colors duration-200"
    >
      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
        <Icon size={24} className="text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;