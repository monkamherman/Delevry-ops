import React, { useMemo } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Route, RouteSegment } from '../types';

interface RoutePolylineProps {
  route: Route;
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  showTooltip?: boolean;
  interactive?: boolean;
  onClick?: (route: Route) => void;
}

// Fonction utilitaire pour convertir une chaîne polyline en tableau de positions
const decodePolyline = (polyline: string): [number, number][] => {
  // Implémentation basique - dans un cas réel, utilisez une bibliothèque comme @mapbox/polyline
  try {
    return JSON.parse(polyline) as [number, number][];
  } catch (e) {
    console.error('Erreur lors du décodage de la polyline:', e);
    return [];
  }
};

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  route,
  color = '#3b82f6',
  weight = 5,
  opacity = 0.8,
  dashArray = '10, 10',
  showTooltip = true,
  interactive = true,
  onClick,
}) => {
  const positions = useMemo(() => {
    if (route.polyline) {
      return decodePolyline(route.polyline);
    }
    return route.waypoints || [];
  }, [route.polyline, route.waypoints]);

  const pathOptions = {
    color,
    weight,
    opacity,
    dashArray,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
  };

  const handleClick = () => {
    if (onClick) {
      onClick(route);
    }
  };

  if (!positions || positions.length < 2) {
    return null;
  }

  // Calcul du point central pour le tooltip
  const centerPoint = (): [number, number] => {
    const lats = positions.map((p) => p[0]);
    const lngs = positions.map((p) => p[1]);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return [centerLat, centerLng];
  };

  // Formatage de la distance et de la durée
  const formatDistance = (meters: number): string => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)} km` 
      : `${Math.round(meters)} m`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')} min`;
    }
    return `${minutes} min`;
  };

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={pathOptions}
        eventHandlers={{
          click: handleClick,
        }}
        interactive={interactive}
      />
      
      {showTooltip && (
        <Tooltip 
          position={centerPoint()}
          direction="center"
          permanent
          className="route-tooltip"
          opacity={0.9}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              Itinéraire #{route.id?.substring(0, 6) || ''}
            </div>
            <div>Distance: {formatDistance(route.totalDistance)}</div>
            <div>Durée: {formatDuration(route.totalDuration)}</div>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default RoutePolyline;
