import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Delivery, Livreur, Position, Route } from '../types';
import LivreurMarker from './LivreurMarker';
import DeliveryMarkers from './DeliveryMarkers';
import RoutePolyline from './RoutePolyline';
import { MapControls } from './MapControls';

// Configuration des icônes par défaut de Leaflet
const configureLeafletIcons = () => {
  try {
    // @ts-ignore - La propriété _getIconUrl est interne à Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  } catch (error) {
    console.error('Erreur lors de la configuration des icônes Leaflet :', error);
  }
};

// Configurer les icônes au chargement du module
configureLeafletIcons();

/**
 * Propriétés du composant LiveTrackingMap
 */
interface LiveTrackingMapProps {
  /** 
   * Position centrale initiale de la carte [latitude, longitude]
   * @example [48.8566, 2.3522] pour Paris
   */
  center: [number, number];
  
  /** 
   * Niveau de zoom initial de la carte
   * @default 13
   */
  zoom?: number;
  
  /** 
   * Liste des livraisons à afficher sur la carte
   */
  deliveries?: Delivery[];
  
  /** 
   * Liste des livreurs à suivre sur la carte
   */
  livreurs?: Livreur[];
  
  /** 
   * Itinéraires à afficher sur la carte
   */
  routes?: Route[];
  
  /** 
   * Fonction appelée lorsque la position de la vue de la carte change
   * @param position - La nouvelle position du centre de la carte
   */
  onPositionUpdate?: (position: Position) => void;
  
  /** 
   * Fonction appelée lors d'un clic sur un marqueur de livraison
   * @param delivery - La livraison cliquée
   */
  onDeliveryClick?: (delivery: Delivery) => void;
  
  /** 
   * Fonction appelée lors d'un clic sur un marqueur de livreur
   * @param livreur - Le livreur cliqué
   */
  onLivreurClick?: (livreur: Livreur) => void;
  
  /** 
   * Fonction appelée lors d'un clic sur un itinéraire
   * @param route - L'itinéraire cliqué
   */
  onRouteClick?: (route: Route) => void;
  
  /** 
   * Classe CSS personnalisée pour le conteneur de la carte
   */
  className?: string;
  
  /** 
   * Styles CSS personnalisés pour le conteneur de la carte
   * @default { height: '100%', width: '100%' }
   */
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
    if (!mapRef.current) return;
    
    try {
      mapRef.current.flyTo(center, zoom, {
        duration: 1,
        noMoveStart: true, // Évite de déclencher l'événement movestart
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la vue de la carte :', error);
    }
  }, [center, zoom]);

  // Gestion des clics sur la carte et nettoyage
  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      try {
        console.log('Clic sur la carte à :', e.latlng);
        // Ici vous pouvez ajouter une logique pour ajouter des marqueurs, etc.
      } catch (error) {
        console.error('Erreur lors du traitement du clic sur la carte :', error);
      }
    };
    
    // S'abonner à l'événement de clic
    currentMap.on('click', handleMapClick);
    
    // Nettoyage lors du démontage du composant
    return () => {
      currentMap.off('click', handleMapClick);
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

  // Rendu du composant
  return (
    <div 
      className={`live-tracking-map ${className}`} 
      style={style}
      data-testid="live-tracking-map"
      aria-label="Carte de suivi en temps réel"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '300px', // Hauteur minimale pour une meilleure expérience utilisateur
        }}
        ref={(mapInstance: L.Map | null) => {
          try {
            if (mapInstance) {
              (mapRef as React.MutableRefObject<L.Map | null>).current = mapInstance;
              
              // Stocker une référence directe à l'instance de carte pour un accès facile
              // depuis la console du navigateur (débogage)
              if (process.env.NODE_ENV === 'development') {
                // @ts-ignore - Pour le débogage uniquement
                window.leafletMap = mapInstance;
              }
            }
          } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
          }
        }}
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBounds={maxBounds}
        zoomControl={false} // Désactiver le contrôle de zoom par défaut (nous utilisons le nôtre)
        scrollWheelZoom={scrollWheelZoom}
        whenReady={() => {
          // Cette fonction est appelée lorsque la carte est entièrement initialisée
          try {
            if (process.env.NODE_ENV !== 'production') {
              console.log('LiveTrackingMap prêt');
            }
          } catch (error) {
            console.error('Erreur lors de l\'initialisation de la carte :', error);
          }
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

// Exporter le composant mémoïsé avec son nom d'affichage pour le débogage
const ExportedLiveTrackingMap = Object.assign(MemoizedLiveTrackingMap, {
  displayName: 'LiveTrackingMap',
  // Propriétés statiques utiles
  defaultProps: {
    zoom: 13,
    deliveries: [],
    livreurs: [],
    routes: [],
    showControls: true,
    showLocateMe: true,
    showZoomControls: true,
    showResetView: true,
    scrollWheelZoom: true,
  },
});

export default ExportedLiveTrackingMap;
