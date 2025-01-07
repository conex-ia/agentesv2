import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../pages/Dashboard/components/Sidebar';
import MobileMenu from '../pages/Dashboard/components/MobileMenu';
import { useUser } from '../hooks/useUser';
import useAuth from '../stores/useAuth';

interface AppLayoutProps {
  children: React.ReactNode;
}

type ActiveScreen = 'dashboard' | 'training' | 'assistants' | 'projetos' | 'knowledge-bases' | 'whatsapp';

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { userData } = useUser();
  const { userUid, userData: authUserData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1370);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  const getActiveScreen = (): ActiveScreen => {
    const path = location.pathname.substring(1);
    return (path || 'dashboard') as ActiveScreen;
  };

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(getActiveScreen());

  useEffect(() => {
    setActiveScreen(getActiveScreen());
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 1370);
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScreenChange = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    navigate(`/${screen}`);
  };

  const userName = userData?.user_nome || authUserData?.user_nome || '';
  const userProfile = userData?.user_perfil || authUserData?.user_perfil || '';

  return (
    <div className="h-screen flex bg-[var(--bg-primary)]">
      {!isMobile && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeScreen={activeScreen}
          setActiveScreen={handleScreenChange}
          userName={userName}
          userProfile={userProfile}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)]">
        {isMobile && (
          <MobileMenu
            userName={userName}
            userProfile={userProfile}
            activeScreen={activeScreen}
            setActiveScreen={handleScreenChange}
          />
        )}

        <div className="flex-1 overflow-auto scrollbar-thin">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
