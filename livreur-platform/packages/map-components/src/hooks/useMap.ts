import { useMap as useLeafletMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

/**
 * Hook personnalisé pour accéder à l'instance de la carte Leaflet
 * et effectuer des opérations avancées
 */
export function useMap() {
  const map = useLeafletMap();

  /**
   * Centre la carte sur une position donnée
   */
  const setView = (latlng: L.LatLngExpression, zoom?: number) => {
    if (map) {
      map.setView(latlng, zoom);
    }
  };

  /**
   * Ajuste les limites de la carte pour afficher tous les marqueurs
   */
  const fitBounds = (bounds: L.LatLngBoundsExpression) => {
    if (map) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  /**
   * Ajoute un contrôle de localisation
   */
  const addLocateControl = () => {
    if (map) {
      const lc = L.control.locate({
        position: 'topleft',
        drawCircle: false,
        flyTo: true,
        showPopup: true,
        markerStyle: {
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8,
        },
      });
      lc.addTo(map);
      return lc;
    }
    return null;
  };

  /**
   * Nettoie les contrôles et les événements lors du démontage
   */
  useEffect(() => {
    return () => {
      // Nettoyage si nécessaire
    };
  }, [map]);

  return {
    map,
    setView,
    fitBounds,
    addLocateControl,
  };
}
