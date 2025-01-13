import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import Projetos from './pages/Dashboard/Projetos';
import Training from './pages/Dashboard/components/Training';
import { KnowledgeBasePage } from './pages/Dashboard/components/KnowledgeBase/KnowledgeBasePage';
import Treinamentos from './pages/Treinamentos';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const [trainingViewType, setTrainingViewType] = useState<'grid' | 'table'>('grid');

  return (
    <Routes>
      {/* Rota pública - Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Rotas protegidas - Requer autenticação */}
      <Route element={<ProtectedRoute><AppLayout><Outlet /></AppLayout></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/training" element={<Training viewType={trainingViewType} onViewTypeChange={setTrainingViewType} />} />
        <Route path="/treinamentos" element={<Treinamentos />} />
        <Route path="/bases" element={<KnowledgeBasePage viewType={trainingViewType} onViewTypeChange={setTrainingViewType} />} />
      </Route>

      {/* Rota de fallback - Redireciona rotas não encontradas para a landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;