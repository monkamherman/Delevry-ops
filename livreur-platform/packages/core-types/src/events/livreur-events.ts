import { LivreurStatus } from '../models/livreur';

export enum LivreurEventType {
  LIVREUR_STATUS_CHANGED = 'livreur_status_changed',
  LIVREUR_LOCATION_UPDATE = 'livreur_location_update',
  LIVREUR_ASSIGNED = 'livreur_assigned',
  LIVREUR_AVAILABLE = 'livreur_available',
  LIVREUR_OFFLINE = 'livreur_offline',
  LIVREUR_SHIFT_STARTED = 'livreur_shift_started',
  LIVREUR_SHIFT_ENDED = 'livreur_shift_ended',
  LIVREUR_ALERT = 'livreur_alert'
}

export interface LivreurBaseEvent {
  livreurId: string;
  timestamp: string;
  emitterId?: string; // ID de l'utilisateur ou du système ayant émis l'événement
}

export interface LivreurStatusChangedEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_STATUS_CHANGED;
  payload: {
    previousStatus: LivreurStatus;
    newStatus: LivreurStatus;
    reason?: string;
    updatedAt: string;
  };
}

export interface LivreurLocationUpdateEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_LOCATION_UPDATE;
  payload: {
    position: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      speed?: number;
      heading?: number;
      timestamp: string;
    };
    batteryLevel?: number;
    isCharging?: boolean;
    networkStatus?: 'online' | 'offline' | 'poor';
  };
}

export interface LivreurAssignedEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_ASSIGNED;
  payload: {
    deliveryId: string;
    assignedAt: string;
    estimatedPickupTime: string;
    estimatedDeliveryTime: string;
    pickupAddress: string;
    deliveryAddress: string;
    customerName: string;
    customerPhone: string;
    notes?: string;
  };
}

export interface LivreurAvailableEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_AVAILABLE;
  payload: {
    lastDeliveryCompletedAt?: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface LivreurOfflineEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_OFFLINE;
  payload: {
    lastSeenAt: string;
    lastKnownLocation?: {
      latitude: number;
      longitude: number;
      timestamp: string;
    };
    reason?: 'manual' | 'timeout' | 'error' | 'maintenance';
  };
}

export interface LivreurShiftStartedEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_SHIFT_STARTED;
  payload: {
    startedAt: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    startingLocation?: {
      latitude: number;
      longitude: number;
    };
    vehicleInfo?: {
      type: string;
      identifier: string;
      lastMaintenance?: string;
    };
  };
}

export interface LivreurShiftEndedEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_SHIFT_ENDED;
  payload: {
    endedAt: string;
    startedAt: string;
    endingLocation?: {
      latitude: number;
      longitude: number;
    };
    deliveriesCompleted: number;
    totalDistance: number; // en mètres
    notes?: string;
  };
}

export enum LivreurAlertType {
  EMERGENCY = 'emergency',
  ACCIDENT = 'accident',
  VEHICLE_ISSUE = 'vehicle_issue',
  LATE_DELIVERY = 'late_delivery',
  CUSTOMER_ISSUE = 'customer_issue',
  OTHER = 'other'
}

export interface LivreurAlertEvent extends LivreurBaseEvent {
  type: LivreurEventType.LIVREUR_ALERT;
  payload: {
    alertType: LivreurAlertType;
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    location?: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    };
    deliveryId?: string;
    additionalData?: Record<string, unknown>;
    acknowledged?: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
  };
}

export type LivreurEvent =
  | LivreurStatusChangedEvent
  | LivreurLocationUpdateEvent
  | LivreurAssignedEvent
  | LivreurAvailableEvent
  | LivreurOfflineEvent
  | LivreurShiftStartedEvent
  | LivreurShiftEndedEvent
  | LivreurAlertEvent;
