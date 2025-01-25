import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/themes.css';
import ThemeProvider from './components/ThemeProvider';

// Carregar variáveis de ambiente do window.env
const env = (window as any).env || {};
Object.keys(env).forEach(key => {
  if (env[key]) {
    (window as any)[key] = env[key];
    import.meta.env[`VITE_${key}`] = env[key]; // Adicionar prefixo VITE_ para compatibilidade
  }
});

// Configurações dinâmicas do título e favicon
if (env.TITULO) {
  document.title = env.TITULO;
}
if (env.FAVICON) {
  const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
  if (favicon) {
    favicon.href = env.FAVICON;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
