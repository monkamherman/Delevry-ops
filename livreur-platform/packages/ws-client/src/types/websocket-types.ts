/**
 * Types de base pour les événements WebSocket
 */

export type WebSocketEventType = 
  | 'position_update'
  | 'status_update'
  | 'delivery_assigned'
  | 'delivery_completed'
  | 'error'
  | 'ping'
  | 'pong';

/**
 * Événement WebSocket générique
 */
export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  data: T;
  timestamp: string;
}

/**
 * Statuts possibles de la connexion WebSocket
 */
export enum WebSocketStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * Erreur WebSocket
 */
export interface WebSocketError {
  type: string;
  message: string;
  error?: Error;
  code?: number;
}

/**
 * Options de configuration du client WebSocket
 */
export interface WebSocketOptions {
  /** Intervalle de reconnexion en millisecondes */
  reconnectInterval?: number;
  /** Nombre maximum de tentatives de reconnexion */
  maxReconnectAttempts?: number;
  /** Active le mode débogage */
  debug?: boolean;
  /** Active la reconnexion automatique */
  autoReconnect?: boolean;
}

/**
 * Map des types d'événements pour le typage fort
 */
export interface WebSocketEventMap {
  // Événements système
  'connected': void;
  'disconnected': { code?: number; reason?: string };
  'status': WebSocketStatus;
  'error': WebSocketError;
  'message': WebSocketEvent;
  
  // Événements métier
  'position_update': PositionUpdateEvent;
  'status_update': StatusUpdateEvent;
  'delivery_assigned': DeliveryAssignedEvent;
  'delivery_completed': DeliveryCompletedEvent;
}

// Types d'événements métier
export interface PositionUpdateEvent {
  livreurId: string;
  position: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: string;
  };
}

export interface StatusUpdateEvent {
  livreurId: string;
  status: 'available' | 'on_delivery' | 'offline' | 'on_break';
  timestamp: string;
}

export interface DeliveryAssignedEvent {
  deliveryId: string;
  livreurId: string;
  estimatedArrival: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface DeliveryCompletedEvent {
  deliveryId: string;
  livreurId: string;
  completedAt: string;
  status: 'delivered' | 'failed' | 'cancelled';
  reason?: string;
}
