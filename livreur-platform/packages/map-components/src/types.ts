import { LatLngExpression, LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { MapContainerProps } from 'react-leaflet';

// Types de base
export type DeliveryStatus = 'pending' | 'in-progress' | 'delivered' | 'failed';
export type LivreurStatus = 'available' | 'on-delivery' | 'offline';
export type VehicleType = 'bike' | 'scooter' | 'car' | 'truck';

export interface Position {
  lat: number;
  lng: number;
  timestamp?: Date;
  accuracy?: number;
  zoom?: number;
}

export interface Delivery {
  id: string;
  position: Position;
  status: DeliveryStatus;
  address: string;
  recipientName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string;
}

export interface RouteSegment {
  from: Position;
  to: Position;
  distance: number; // en mètres
  duration: number; // en secondes
  instructions?: string;
  polyline?: string;
  steps?: {
    distance: number;
    duration: number;
    instruction: string;
    name: string;
    type: number;
    way_points: [number, number];
  }[];
}

export interface Route {
  id: string;
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  waypoints: LatLngTuple[];
  polyline: string;
  metadata?: {
    origin: string;
    destination: string;
    mode: 'driving' | 'walking' | 'cycling' | 'truck';
    departureTime?: Date;
    arrivalTime?: Date;
  };
}

export interface Livreur {
  id: string;
  name: string;
  position: Position;
  status: LivreurStatus;
  currentDeliveryId?: string;
  vehicleType?: VehicleType;
  lastUpdated: Date;
  contact?: {
    phone?: string;
    email?: string;
  };
  stats?: {
    totalDeliveries: number;
    rating?: number;
    averageDeliveryTime?: number;
  };
}

// Props des composants
export interface LivreurMarkerProps {
  livreur: Livreur;
  onClick?: (livreur: Livreur) => void;
  zIndexOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface DeliveryMarkersProps {
  deliveries: Delivery[];
  onDeliveryClick?: (delivery: Delivery) => void;
  showTooltip?: boolean;
  zIndexOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface RoutePolylineProps {
  route: Route;
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  showTooltip?: boolean;
  interactive?: boolean;
  onClick?: (route: Route) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface LiveTrackingMapProps extends Omit<MapContainerProps, 'center'> {
  center: LatLngTuple;
  deliveries?: Delivery[];
  livreurs?: Livreur[];
  routes?: Route[];
  onPositionUpdate?: (position: Position) => void;
  onDeliveryClick?: (delivery: Delivery) => void;
  onLivreurClick?: (livreur: Livreur) => void;
  onRouteClick?: (route: Route) => void;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: LatLngBoundsExpression;
  zoomControl?: boolean;
  scrollWheelZoom?: boolean | 'center';
  children?: React.ReactNode;
}

// Types utilitaires
export type IconConfig = {
  [key in VehicleType]: string;
};

export type StatusColors = {
  [key in LivreurStatus]: string;
};

export type DeliveryStatusIcons = {
  [key in DeliveryStatus]: string;
};

export type DeliveryStatusLabels = {
  [key in DeliveryStatus]: string;
};

// Valeurs par défaut
export const DEFAULT_ICONS: IconConfig = {
  bike: '🚲',
  scooter: '🛵',
  car: '🚗',
  truck: '🚚',};

export const DEFAULT_STATUS_COLORS: StatusColors = {
  available: '#4CAF50',
  'on-delivery': '#FFC107',
  offline: '#9E9E9E',
};

export const DELIVERY_STATUS_ICONS: DeliveryStatusIcons = {
  pending: '🟡',
  'in-progress': '🔵',
  delivered: '🟢',
  failed: '🔴',
};

export const DELIVERY_STATUS_LABELS: DeliveryStatusLabels = {
  pending: 'En attente',
  'in-progress': 'En cours',
  delivered: 'Livrée',
  failed: 'Échouée',
};
