import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import Projetos from './pages/Dashboard/Projetos';
import Treinamentos from './pages/Treinamentos';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { ProjectProvider } from './contexts/ProjectContext';
import './config/chartConfig';

const App: React.FC = () => {
  return (
    <ProjectProvider>
      <Routes>
        {/* Rota pública - Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Rotas protegidas - Requer autenticação */}
        <Route element={<ProtectedRoute><AppLayout><Outlet /></AppLayout></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/treinamentos" element={<Treinamentos />} />
        </Route>

        {/* Rota de fallback - Redireciona rotas não encontradas para a landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProjectProvider>
  );
};

export default App;