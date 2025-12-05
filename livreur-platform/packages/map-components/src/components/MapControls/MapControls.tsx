import React, { useCallback, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { MapControlButton } from './MapControlButton';
import { MapControlGroup } from './MapControlGroup';

interface MapControlsProps {
  /**
   * Position du contrôle sur la carte
   * @default 'bottomright'
   */
  position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  
  /**
   * Afficher le bouton de localisation
   * @default true
   */
  showLocateMe?: boolean;
  
  /**
   * Afficher le bouton de zoom
   * @default true
   */
  showZoom?: boolean;
  
  /**
   * Afficher le bouton de réinitialisation de la vue
   * @default true
   */
  showResetView?: boolean;
  
  /**
   * Position initiale de la carte pour la réinitialisation
   * @default [0, 0]
   */
  initialCenter?: LatLngTuple;
  
  /**
   * Niveau de zoom initial pour la réinitialisation
   * @default 2
   */
  initialZoom?: number;
}

/**
 * Composant de contrôles de carte personnalisés
 * 
 * @example
 * ```tsx
 * <MapContainer>
 *   <MapControls 
 *     showLocateMe={true}
 *     showZoom={true}
 *     showResetView={true}
 *     position="topright"
 *   />
 * </MapContainer>
 * ```
 */
export const MapControls: React.FC<MapControlsProps> = ({
  position = 'bottomright',
  showLocateMe = true,
  showZoom = true,
  showResetView = true,
  initialCenter = [0, 0],
  initialZoom = 2,
}) => {
  const map = useMap();

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 15, {
            duration: 1,
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, [map]);

  const handleZoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);

  const handleResetView = useCallback(() => {
    map.flyTo(initialCenter, initialZoom, {
      duration: 1,
    });
  }, [map, initialCenter, initialZoom]);

  // Mémoïsation des contrôles pour éviter les rendus inutiles
  const controls = useMemo(() => {
    const controlElements: JSX.Element[] = [];

    if (showLocateMe) {
      controlElements.push(
        <MapControlButton
          key="locate-me"
          onClick={handleLocateMe}
          title="Me localiser"
          icon="📍"
        />
      );
    }

    if (showZoom) {
      controlElements.push(
        <MapControlButton
          key="zoom-in"
          onClick={handleZoomIn}
          title="Zoom avant"
          icon="+"
        />,
        <MapControlButton
          key="zoom-out"
          onClick={handleZoomOut}
          title="Zoom arrière"
          icon="−"
        />
      );
    }

    if (showResetView) {
      controlElements.push(
        <MapControlButton
          key="reset-view"
          onClick={handleResetView}
          title="Réinitialiser la vue"
          icon="↺"
        />
      );
    }

    return controlElements;
  }, [
    showLocateMe,
    showZoom,
    showResetView,
    handleLocateMe,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  ]);

  if (controls.length === 0) {
    return null;
  }

  return <MapControlGroup position={position}>{controls}</MapControlGroup>;
};

MapControls.displayName = 'MapControls';

export default MapControls;
