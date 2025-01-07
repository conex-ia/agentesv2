import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import useAuthModal from '../hooks/useAuthModal';

const Navbar = () => {
  const { openModal } = useAuthModal();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#111827]/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Bot size={32} className="text-emerald-500" />
            <span className="text-2xl font-bold text-white">ConexIA</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="text-gray-300 hover:text-white transition-colors">
              Recursos
            </a>
            <a href="#vantagens" className="text-gray-300 hover:text-white transition-colors">
              Vantagens
            </a>
            <a href="#sobre" className="text-gray-300 hover:text-white transition-colors">
              Sobre
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => openModal('login')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => openModal('signup')}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;