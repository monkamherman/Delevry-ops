import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  /* Style spécifique pour les contrôles Leaflet */
  .leaflet-control & {
    background: none;
    box-shadow: none;
  }
`;

interface MapControlGroupProps {
  /**
   * Position du groupe de contrôles sur la carte
   * @default 'bottomright'
   */
  position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  
  /**
   * Enfants à afficher dans le groupe
   */
  children: React.ReactNode;
  
  /**
   * Classe CSS personnalisée
   */
  className?: string;
}

/**
 * Groupe de contrôles pour la carte
 * 
 * @example
 * ```tsx
 * <MapControlGroup position="topright">
 *   <MapControlButton icon="+" onClick={handleZoomIn} title="Zoom avant" />
 *   <MapControlButton icon="−" onClick={handleZoomOut} title="Zoom arrière" />
 * </MapControlGroup>
 * ```
 */
const MapControlGroup: React.FC<MapControlGroupProps> = ({
  position = 'bottomright',
  children,
  className = '',
}) => {
  const map = useMap();
  const controlRef = useRef<L.Control>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !containerRef.current) return;

    // Créer un contrôle personnalisé Leaflet
    const CustomControl = L.Control.extend({
      onAdd: () => containerRef.current!,
      onRemove: () => {
        // Nettoyage si nécessaire
      },
    });

    // Initialiser le contrôle
    controlRef.current = new CustomControl({ position });
    controlRef.current.addTo(map);

    // Nettoyage lors du démontage
    return () => {
      if (controlRef.current) {
        controlRef.current.remove();
      }
    };
  }, [map, position]);

  return (
    <div style={{ display: 'none' }}>
      <ControlContainer 
        ref={containerRef} 
        className={`leaflet-control ${className}`}
      >
        {children}
      </ControlContainer>
    </div>
  );
};

MapControlGroup.displayName = 'MapControlGroup';

export { MapControlGroup };

export default MapControlGroup;
