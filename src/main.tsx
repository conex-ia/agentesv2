import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/themes.css';
import ThemeProvider from './components/ThemeProvider';

// Configurações dinâmicas do título e favicon
if (import.meta.env.VITE_TITULO) {
  document.title = import.meta.env.VITE_TITULO;
}
if (import.meta.env.VITE_FAVICON) {
  const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
  if (favicon) {
    favicon.href = import.meta.env.VITE_FAVICON;
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
