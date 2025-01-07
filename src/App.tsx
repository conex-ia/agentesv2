import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import useAuth from './stores/useAuth';
import AppLayout from './components/AppLayout';
import AssistantSettings from './pages/Dashboard/components/AssistantSettings';
import { useUser } from './hooks/useUser';
import Projetos from './pages/Dashboard/Projetos';
import Training from './pages/Dashboard/components/Training';
import { KnowledgeBasePage } from './pages/Dashboard/components/KnowledgeBase/KnowledgeBasePage';

const App: React.FC = () => {
  const { userUid } = useAuth();
  const { userData } = useUser();
  const [trainingViewType, setTrainingViewType] = React.useState<'grid' | 'table'>(() => {
    const savedViewType = localStorage.getItem('trainingViewType');
    return (savedViewType as 'grid' | 'table') || 'grid';
  });

  React.useEffect(() => {
    localStorage.setItem('trainingViewType', trainingViewType);
  }, [trainingViewType]);

  if (!userUid) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/assistants" element={<AssistantSettings userName={userData?.name || ''} />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/training" element={<Training viewType={trainingViewType} onViewTypeChange={setTrainingViewType} />} />
          <Route path="/bases" element={<KnowledgeBasePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </div>
  );
};

export default App;