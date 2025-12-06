export interface Position {
  lat: number;
  lng: number;
  timestamp?: string;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LivreurPosition extends Position {
  status?: string;
}

export interface Delivery {
  id: string;
  clientId: string;
  livreurId?: string;
  status: DeliveryStatus;
  addresses: Address[];
  optimizedRoute?: OptimizedRoute;
  estimatedDuration?: number;
  actualDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OptimizedRoute {
  waypoints: Position[];
  totalDistance: number;
  estimatedDuration: number;
  polyline: string;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  polyline: string;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  formatted: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TimeWindow {
  start: string;
  end: string;
}

export enum DeliveryStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export enum LivreurStatus {
  OFFLINE = "offline",
  AVAILABLE = "available",
  BUSY = "busy",
  ON_BREAK = "on_break",
  OFFLINE_DUTY = "offline_duty",
}

export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Metadata {
  [key: string]: any;
}
