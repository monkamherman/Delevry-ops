import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Delivery, Livreur, Position, Route } from '../types';
import LivreurMarker from './LivreurMarker';
import DeliveryMarkers from './DeliveryMarkers';
import RoutePolyline from './RoutePolyline';
import { MapControls } from './MapControls';

// Correction pour les icônes manquantes dans Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LiveTrackingMapProps {
  /** Position centrale de la carte [lat, lng] */
  center: [number, number];
  
  /** Niveau de zoom initial */
  zoom?: number;
  
  /** Liste des livraisons à afficher */
  deliveries?: Delivery[];
  
  /** Liste des livreurs à afficher */
  livreurs?: Livreur[];
  
  /** Itinéraires à afficher */
  routes?: Route[];
  
  /** Fonction appelée lorsque la position de la carte change */
  onPositionUpdate?: (position: Position) => void;
  
  /** Fonction appelée lors d'un clic sur une livraison */
  onDeliveryClick?: (delivery: Delivery) => void;
  
  /** Fonction appelée lors d'un clic sur un livreur */
  onLivreurClick?: (livreur: Livreur) => void;
  
  /** Fonction appelée lors d'un clic sur un itinéraire */
  onRouteClick?: (route: Route) => void;
  
  /** Classe CSS personnalisée */
  className?: string;
  
  /** Styles CSS personnalisés */
  style?: React.CSSProperties;
  
  /** Composants enfants à afficher sur la carte */
  children?: React.ReactNode;
  
  /** Afficher les contrôles de la carte */
  showControls?: boolean;
  
  /** Zoom minimum autorisé */
  minZoom?: number;
  
  /** Zoom maximum autorisé */
  maxZoom?: number;
  
  /** Bornes maximales de la carte */
  maxBounds?: L.LatLngBoundsExpression;
  
  /** Afficher le contrôle de zoom */
  zoomControl?: boolean;
  
  /** Activer le zoom avec la molette de la souris */
  scrollWheelZoom?: boolean | 'center';
  
  /** Afficher le bouton de localisation */
  showLocateMe?: boolean;
  
  /** Afficher les boutons de zoom */
  showZoomControls?: boolean;
  
  /** Afficher le bouton de réinitialisation de la vue */
  showResetView?: boolean;
}

// Composant pour gérer les événements de la carte
const MapEvents = memo(({
  onPositionUpdate,
}: {
  onPositionUpdate?: (position: Position) => void;
}) => {
  const map = useMap();
  const positionRef = useRef<[number, number]>([0, 0]);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const handleMoveEnd = useCallback(() => {
    if (onPositionUpdate) {
      const center = map.getCenter();
      
      // Annuler le timer précédent s'il existe
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Définir un nouveau timer pour éviter les mises à jour trop fréquentes
      debounceTimer.current = setTimeout(() => {
        const newPosition: Position = {
          lat: center.lat,
          lng: center.lng,
          timestamp: new Date(),
        };

        // Éviter les mises à jour inutiles
        if (
          positionRef.current[0] !== newPosition.lat ||
          positionRef.current[1] !== newPosition.lng
        ) {
          positionRef.current = [newPosition.lat, newPosition.lng];
          onPositionUpdate(newPosition);
        }
      }, 100); // Délai de 100ms
    }
  }, [map, onPositionUpdate]);

  useMapEvents({
    moveend: handleMoveEnd,
  });

  return null;
});

MapEvents.displayName = 'MapEvents';

/**
 * Composant LiveTrackingMap
 * 
 * Une carte interactive pour le suivi en temps réel des livreurs et des livraisons.
 * 
 * @example
 * ```tsx
 * <LiveTrackingMap
 *   center={[48.8566, 2.3522]}
 *   zoom={13}
 *   deliveries={deliveries}
 *   livreurs={livreurs}
 *   routes={routes}
 *   onPositionUpdate={handlePositionUpdate}
 *   onDeliveryClick={handleDeliveryClick}
 *   onLivreurClick={handleLivreurClick}
 *   onRouteClick={handleRouteClick}
 *   showControls={true}
 *   style={{ height: '500px' }}
 * />
 * ```
 */
const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  center,
  zoom = 13,
  deliveries = [],
  livreurs = [],
  routes = [],
  onPositionUpdate,
  onDeliveryClick = () => {},
  onLivreurClick = () => {},
  onRouteClick = () => {},
  className = '',
  style = { height: '100%', width: '100%' },
  children,
  showControls = true,
  minZoom = 2,
  maxZoom = 18,
  maxBounds,
  zoomControl = true,
  scrollWheelZoom = true,
  showLocateMe = true,
  showZoomControls = true,
  showResetView = true,
}) => {
  const mapRef = useRef<L.Map>(null);
  const initialCenterRef = useRef(center);
  const initialZoomRef = useRef(zoom);

  // Déclaration de la fonction de gestion du clic
  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      // Vous pouvez ajouter une logique personnalisée pour les clics sur la carte ici
      console.log('Clic sur la carte à :', e.latlng);
    },
    []
  );

  // Mettre à jour la vue lorsque le centre ou le zoom changent
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, {
        duration: 1,
      });
    }
  }, [center, zoom]);

  // Nettoyage des écouteurs d'événements lors du démontage
  useEffect(() => {
    const currentMap = mapRef.current;
    const clickHandler = (e: L.LeafletMouseEvent) => {
      console.log('Clic sur la carte à :', e.latlng);
    };
    
    if (currentMap) {
      currentMap.on('click', clickHandler);
    }
    
    return () => {
      if (currentMap) {
        currentMap.off('click', clickHandler);
      }
    };
  }, []);

  // Mémoriser les marqueurs de livraison
  const deliveryMarkers = useMemo(() => {
    if (!deliveries || !deliveries.length) return null;
    return (
      <DeliveryMarkers
        deliveries={deliveries}
        onDeliveryClick={onDeliveryClick}
      />
    );
  }, [deliveries, onDeliveryClick]);

  // Mémoriser les marqueurs de livreurs
  const livreurMarkers = useMemo(() => {
    if (!livreurs || !livreurs.length) return null;
    return livreurs.map((livreur, index) => (
      <LivreurMarker
        key={livreur.id || `livreur-${index}`}
        livreur={livreur}
        onClick={onLivreurClick}
      />
    ));
  }, [livreurs, onLivreurClick]);

  // Mémoriser les itinéraires
  const routePolylines = useMemo(() => {
    if (!routes || !routes.length) return null;
    return routes.map((route, index) => (
      <RoutePolyline
        key={route.id || `route-${index}`}
        route={route}
        onClick={onRouteClick}
      />
    ));
  }, [routes, onRouteClick]);

  return (
    <div 
      className={`live-tracking-map ${className}`} 
      style={style}
      data-testid="live-tracking-map"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={(mapInstance: L.Map | null) => {
          // Utiliser une fonction de rappel pour définir la référence
          if (mapInstance) {
            (mapRef as React.MutableRefObject<L.Map | null>).current = mapInstance;
          }
        }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBounds={maxBounds}
        zoomControl={false} // Désactiver le contrôle de zoom par défaut
        scrollWheelZoom={scrollWheelZoom}
        whenReady={() => {
          // Effectuer des opérations d'initialisation ici si nécessaire
          console.log('La carte est prête');
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Événements de la carte */}
        {showControls && onPositionUpdate && (
          <MapEvents onPositionUpdate={onPositionUpdate} />
        )}

        {/* Contrôles personnalisés */}
        {showControls && (
          <MapControls
            showLocateMe={showLocateMe}
            showZoom={showZoomControls}
            showResetView={showResetView}
            initialCenter={initialCenterRef.current}
            initialZoom={initialZoomRef.current}
          />
        )}

        {/* Itinéraires */}
        {routePolylines}

        {/* Livreurs */}
        {livreurMarkers}

        {/* Livraisons */}
        {deliveryMarkers}

        {/* Composants enfants personnalisés */}
        {children}
      </MapContainer>
    </div>
  );
};

// Utilisation de memo pour optimiser les rendus
const MemoizedLiveTrackingMap = memo(LiveTrackingMap);
MemoizedLiveTrackingMap.displayName = 'LiveTrackingMap';

export default MemoizedLiveTrackingMap;
