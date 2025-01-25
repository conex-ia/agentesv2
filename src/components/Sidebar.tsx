import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle2, 
  GraduationCap,
  Bot, 
  BarChart2, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Building,
  FolderOpen,
  MessageCircle,
  Package2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../stores/useAuth';

type ActiveScreen = 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp' | 'produtos';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  userName: string;
  userProfile?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  activeScreen,
  setActiveScreen,
  userName,
  userProfile
}) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleScreenChange = (screen: ActiveScreen | null) => {
    if (screen) {
      setActiveScreen(screen);
      if (screen === 'dashboard') navigate('/dashboard');
      else if (screen === 'whatsapp') navigate('/whatsapp');
      else if (screen === 'assistants') navigate('/assistants');
      else if (screen === 'projetos') navigate('/projetos');
      else if (screen === 'training') navigate('/training');
      else if (screen === 'produtos') navigate('/produtos');
    }
  };

  const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/user-perfil.png';

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      screen: 'dashboard' as ActiveScreen,
      active: activeScreen === 'dashboard'
    },
    { 
      icon: GraduationCap, 
      label: 'Treinamento', 
      screen: 'training' as ActiveScreen,
      active: activeScreen === 'training'
    },
    { 
      icon: Package2, 
      label: 'Produtos', 
      screen: 'produtos' as ActiveScreen,
      active: activeScreen === 'produtos'
    },
    { 
      icon: MessageCircle,
      label: 'WhatsApp',
      screen: 'whatsapp' as ActiveScreen,
      active: activeScreen === 'whatsapp'
    },
    { 
      icon: Bot, 
      label: 'Personalizar', 
      screen: 'assistants' as ActiveScreen,
      active: activeScreen === 'assistants'
    },
    { 
      icon: FolderOpen, 
      label: 'Projetos', 
      screen: 'projetos' as ActiveScreen,
      active: activeScreen === 'projetos'
    },
    { 
      icon: BarChart2, 
      label: 'Estatísticas', 
      screen: null,
      active: false 
    }
  ];

  return (
    <motion.div
      className={`flex flex-col h-screen p-4 bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
        isCollapsed ? 'w-[80px]' : 'w-[250px]'
      }`}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
        <UserCircle2 className="w-8 h-8 text-emerald-500" />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userProfile}</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex flex-col flex-grow gap-1 mt-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={index}
            onClick={() => item.screen && handleScreenChange(item.screen)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              item.active ? 'bg-emerald-500 text-white' : 'hover:bg-gray-800'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </motion.button>
        ))}
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-center w-full gap-2 px-3 py-2 mt-4 text-sm text-gray-400 transition-colors rounded-lg hover:bg-gray-800"
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <>
            <ChevronLeft className="w-5 h-5" />
            <span>Recolher menu</span>
          </>
        )}
      </button>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 mt-2 text-red-500 transition-colors rounded-lg hover:bg-gray-800"
        whileTap={{ scale: 0.95 }}
      >
        <LogOut className="w-5 h-5" />
        {!isCollapsed && <span>Sair</span>}
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;