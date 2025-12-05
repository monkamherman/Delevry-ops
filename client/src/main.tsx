import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { QueryProvider } from './providers/QueryProvider';
import './styles/leaflet.css';

// Fonction pour initialiser les icônes Leaflet
const initLeaflet = () => {
  // Ne s'exécute que côté client
  if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }
};

// Initialiser Leaflet au chargement du composant
initLeaflet();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </QueryProvider>
  </StrictMode>
);
