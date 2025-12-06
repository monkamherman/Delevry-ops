export enum DeliveryStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum DeliveryPriority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  formatted?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PackageInfo {
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  description?: string;
  specialInstructions?: string;
}

export interface TimeWindow {
  start: string;
  end: string;
}

export interface Position {
  lat: number;
  lng: number;
  timestamp?: string;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  polyline: string;
}

export interface OptimizedRoute {
  waypoints: Position[];
  totalDistance: number;
  estimatedDuration: number;
  polyline: string;
  steps: RouteStep[];
}

export interface Delivery {
  id: string;
  clientId: string;
  livreurId?: string;
  status: DeliveryStatus;
  addresses: Address[];
  priority: DeliveryPriority;
  packageInfo?: PackageInfo;
  timeWindow?: TimeWindow;
  optimizedRoute?: OptimizedRoute;
  estimatedDuration?: number;
  actualDuration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface DeliveryTracking {
  delivery: Delivery;
  currentLocation?: Position;
  estimatedArrival?: string;
  progress: number; // 0-100
  remainingDistance?: number;
  remainingTime?: number;
  lastUpdate: string;
}
