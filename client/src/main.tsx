import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from './providers/QueryProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryProvider>
  </StrictMode>
);
