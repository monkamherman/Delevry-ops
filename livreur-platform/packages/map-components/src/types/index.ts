import { LatLngExpression } from 'leaflet';

export interface MapContainerProps {
  center: LatLngExpression;
  zoom?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export interface MarkerProps {
  position: LatLngExpression;
  icon?: L.Icon | L.DivIcon;
  draggable?: boolean;
  title?: string;
  onClick?: (e: L.LeafletMouseEvent) => void;
  onDragEnd?: (e: L.LeafletEvent) => void;
  children?: React.ReactNode;
}

export interface PolylineProps {
  positions: LatLngExpression[] | LatLngExpression[][];
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  lineCap?: 'butt' | 'round' | 'square' | 'inherit';
  lineJoin?: 'miter' | 'round' | 'bevel' | 'inherit';
  className?: string;
  onClick?: (e: L.LeafletMouseEvent) => void;
}

export interface MapContextType {
  map: L.Map | null;
  setMap: (map: L.Map) => void;
}
