import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import WhatsApp from './pages/WhatsApp';
import Projetos from './pages/Projetos';
import Treinamentos from './pages/Treinamentos';
import Laboratorio from './pages/Laboratorio';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import { ProjectProvider } from './contexts/ProjectContext';
import { KnowledgeBaseProvider } from './contexts/KnowledgeBaseContext';
import './config/chartConfig';

const App: React.FC = () => {
  return (
    <ProjectProvider>
      <KnowledgeBaseProvider>
        <Routes>
          {/* Rota pública - Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Rotas protegidas - Requer autenticação */}
          <Route element={<ProtectedRoute><AppLayout><Outlet /></AppLayout></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/treinamentos" element={<Treinamentos />} />
            <Route path="/laboratorio" element={<Laboratorio />} />
          </Route>

          {/* Rota de fallback - Redireciona rotas não encontradas para a landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KnowledgeBaseProvider>
    </ProjectProvider>
  );
};

export default App;