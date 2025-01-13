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
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../stores/useAuth';

type ActiveScreen = 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp';

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
      icon: GraduationCap, 
      label: 'Treinamento', 
      screen: 'training' as ActiveScreen,
      active: activeScreen === 'training'
    },
    { icon: BarChart2, label: 'Estatísticas', screen: null, active: false }
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      style={{ 
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)'
      }}
      className="relative h-screen flex flex-col transition-all duration-300 ease-in-out"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)'
        }}
        className="absolute -right-3 top-6 w-6 h-6 border rounded-full flex items-center justify-center hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={userProfile || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
            className="w-10 h-10 rounded-lg object-cover"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 
                className="text-sm font-medium truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {userName}
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleScreenChange(item.screen)}
                disabled={!item.screen}
                style={{ 
                  backgroundColor: item.active ? 'var(--sidebar-active-bg)' : 'transparent',
                  color: item.active ? 'var(--sidebar-active-text)' : 'var(--sidebar-text-secondary)'
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  hover:text-white hover:bg-[var(--sidebar-active-bg)]
                  ${!item.screen && 'opacity-50 cursor-not-allowed'}
                `}
              >
                <item.icon size={20} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          style={{ color: 'var(--sidebar-text-secondary)' }}
          className="w-full flex items-center gap-3 px-3 py-2 hover:text-white hover:bg-[var(--sidebar-active-bg)] rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="text-sm font-medium">
              Sair
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;