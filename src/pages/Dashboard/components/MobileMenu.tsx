import React from 'react';
import { Menu } from '@headlessui/react';
import { LayoutDashboard, Bot, GraduationCap, BarChart2, LogOut, FolderOpen, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../stores/useAuth';

interface MobileMenuProps {
  userName: string;
  userProfile?: string | null;
  activeScreen: 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp';
  setActiveScreen: (screen: 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp') => void;
}

type ActiveScreen = 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp';

function isValidScreen(screen: string): screen is ActiveScreen {
  return ['dashboard', 'training', 'assistants', 'projetos', 'knowledge-bases', 'whatsapp'].includes(screen);
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  userName,
  userProfile,
  activeScreen,
  setActiveScreen
}) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/user-perfil.png';

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', screen: 'dashboard' },
    { icon: MessageCircle, label: 'WhatsApp', screen: 'whatsapp' },
    { icon: Bot, label: 'Assistentes', screen: 'assistants' },
    { icon: FolderOpen, label: 'Projetos', screen: 'projetos' },
    { icon: GraduationCap, label: 'Treinamento', screen: 'training' },
    { icon: BarChart2, label: 'Estatísticas', screen: null },
  ] as const;

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button 
            className="flex items-center gap-3 p-4 rounded-lg w-full bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] text-[var(--sidebar-text)]"
          >
            <img 
              src={userProfile || DEFAULT_PROFILE_IMAGE} 
              alt={userName} 
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 text-left">
              <span>{userName}</span>
            </div>
          </Menu.Button>

          {open && (
            <Menu.Items 
              className="absolute left-0 right-0 mt-1 py-1 rounded-lg shadow-lg focus:outline-none z-50 bg-[var(--sidebar-bg)]"
            >
              {menuItems.map((item) => (
                <Menu.Item key={item.label}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        if (item.screen && isValidScreen(item.screen)) {
                          setActiveScreen(item.screen);
                          if (item.screen === 'dashboard') navigate('/dashboard');
                          else if (item.screen === 'whatsapp') navigate('/whatsapp');
                          else if (item.screen === 'assistants') navigate('/assistants');
                          else if (item.screen === 'projetos') navigate('/projetos');
                          else if (item.screen === 'training') navigate('/training');
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors
                        ${activeScreen === item.screen 
                          ? 'bg-[var(--sidebar-item-active-bg)] text-[var(--sidebar-active-text)]' 
                          : 'text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)] hover:bg-[var(--sidebar-item-hover-bg)]'
                        }
                        ${!item.screen && 'opacity-50 cursor-not-allowed'}
                      `}
                      disabled={!item.screen}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-hover)] hover:bg-[var(--sidebar-item-hover-bg)] rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    Sair
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
};

export default MobileMenu;
