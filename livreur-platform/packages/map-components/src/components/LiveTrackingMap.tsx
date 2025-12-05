import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Delivery, Livreur, Position, Route } from '../types';
import LivreurMarker from './LivreurMarker';
import DeliveryMarkers from './DeliveryMarkers';
import RoutePolyline from './RoutePolyline';

// Correction pour les icônes manquantes dans Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LiveTrackingMapProps {
  center: [number, number];
  zoom?: number;
  deliveries?: Delivery[];
  livreurs?: Livreur[];
  routes?: Route[];
  onPositionUpdate?: (position: Position) => void;
  onDeliveryClick?: (delivery: Delivery) => void;
  onLivreurClick?: (livreur: Livreur) => void;
  onRouteClick?: (route: Route) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  showControls?: boolean;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: L.LatLngBoundsExpression;
  zoomControl?: boolean;
  scrollWheelZoom?: boolean | 'center';
}
// Composant pour gérer les événements de la carte
const MapEvents = ({
  onPositionUpdate,
}: {
  onPositionUpdate?: (position: Position) => void;
}) => {
  const map = useMap();
  const positionRef = useRef<[number, number]>([0, 0]);

  useMapEvents({
    moveend() {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const newPosition = {
        lat: center.lat,
        lng: center.lng,
        zoom,
      };
      
      // Éviter les mises à jour trop fréquentes
      if (
        positionRef.current[0] !== newPosition.lat ||
        positionRef.current[1] !== newPosition.lng
      ) {
        positionRef.current = [newPosition.lat, newPosition.lng];
        if (onPositionUpdate) {
          onPositionUpdate(newPosition);
        }
      }
    },
  });

  return null;
};

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  center,
  zoom = 13,
  deliveries = [],
  livreurs = [],
  routes = [],
  onPositionUpdate,
  onDeliveryClick,
  onLivreurClick,
  onRouteClick,
  className = '',
  style = { height: '100%', width: '100%' },
  children,
  showControls = true,
  minZoom = 2,
  maxZoom = 18,
  maxBounds,
  zoomControl = true,
  scrollWheelZoom = true,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Vérifier si on est côté client pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{ ...style, backgroundColor: '#f0f0f0' }} />;
  }

  return (
    <div className={`live-tracking-map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={zoomControl}
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBounds={maxBounds}
        scrollWheelZoom={scrollWheelZoom}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Gestion des événements de la carte */}
        <MapEvents onPositionUpdate={onPositionUpdate} />

        {/* Affichage des itinéraires */}
        {routes.map((route) => (
          <RoutePolyline
            key={route.id}
            route={route}
            onClick={onRouteClick}
            color="#3b82f6"
            weight={5}
            opacity={0.8}
          />
        ))}

        {/* Affichage des livraisons */}
        {deliveries.length > 0 && (
          <DeliveryMarkers
            deliveries={deliveries}
            onDeliveryClick={onDeliveryClick}
            showTooltip={true}
          />
        )}

        {/* Affichage des livreurs */}
        {livreurs.map((livreur) => (
          <LivreurMarker
            key={livreur.id}
            livreur={livreur}
            onClick={onLivreurClick}
            zIndexOffset={1000} // Pour que les marqueurs soient au-dessus des itinéraires
          />
        ))}

        {/* Contenu supplémentaire */}
        {children}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingMap;
