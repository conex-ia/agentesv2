import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, GraduationCap, Bot, BarChart2, LogOut, ArrowUpRight, Beaker, Package2, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../stores/useAuth';

interface MobileMenuProps {
  userName: string;
  userProfile?: string;
  activeScreen: string;
  setActiveScreen: (screen: 'dashboard' | 'training' | 'personalizar' | 'projetos' | 'knowledge-bases' | 'whatsapp' | 'laboratorio' | 'produtos' | 'bases') => void;
}

const MobileMenu = ({ userName, userProfile, activeScreen, setActiveScreen }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleScreenChange = (screen: 'dashboard' | 'training' | 'laboratorio' | 'produtos' | 'bases') => {
    setActiveScreen(screen);
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      screen: 'dashboard' as const,
      active: activeScreen === 'dashboard'
    },
    { 
      icon: GraduationCap, 
      label: 'Treinamento', 
      screen: 'training' as const,
      active: activeScreen === 'training'
    },
    {
      icon: Database,
      label: 'Bases',
      screen: 'bases' as const,
      active: activeScreen === 'bases'
    },
    { 
      icon: Package2, 
      label: 'Produtos', 
      screen: 'produtos' as const,
      active: activeScreen === 'produtos'
    },
    { 
      icon: Beaker, 
      label: 'Laboratório', 
      screen: 'laboratorio' as const, 
      active: activeScreen === 'laboratorio' 
    },
    { 
      icon: Bot, 
      label: 'Assistentes', 
      screen: null, 
      active: false 
    },
    { 
      icon: BarChart2, 
      label: 'Estatísticas', 
      screen: null, 
      active: false 
    }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50"
    >
      <div className="grid grid-cols-5 gap-1 p-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.screen && handleScreenChange(item.screen)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              item.active ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
            }`}
            disabled={!item.screen}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
};

export default MobileMenu;