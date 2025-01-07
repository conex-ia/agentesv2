import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, FileText, Shield } from 'lucide-react';

const links = [
  {
    icon: <Instagram size={20} />,
    text: 'Siga-nos no Instagram',
    href: 'https://instagram.com/conexia',
  },
  {
    icon: <Linkedin size={20} />,
    text: 'Conecte-se no LinkedIn',
    href: 'https://linkedin.com/company/conexia',
  },
  {
    icon: <FileText size={20} />,
    text: 'Termos de Uso',
    href: '/termos',
  },
  {
    icon: <Shield size={20} />,
    text: 'Política de Privacidade',
    href: '/privacidade',
  },
];

const LinksSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Links Importantes</h2>
      <ul className="space-y-4">
        {links.map((link, index) => (
          <motion.li key={index} whileHover={{ x: 5 }}>
            <a
              href={link.href}
              className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              {link.icon}
              <span>{link.text}</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default LinksSection;