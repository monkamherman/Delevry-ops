// Types d'événements WebSocket
export * from './position-events';
export * from './delivery-events';
export * from './livreur-events';

// Ré-export des types d'événements pour un accès facile
export * from '../models/position';
export * from '../models/livreur';

// Types utilitaires pour les événements
export interface BaseEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  emitterId: string;
}

export interface EventHandler<T = unknown> {
  (event: T): void | Promise<void>;
}

// Types de canaux de diffusion
export enum EventChannel {
  POSITION_UPDATES = 'position_updates',
  DELIVERY_UPDATES = 'delivery_updates',
  SYSTEM_ALERTS = 'system_alerts',
  ADMIN_UPDATES = 'admin_updates'
}

// Ré-export des types pour faciliter l'import
export type {
  PositionUpdateEvent,
  PositionHistoryEvent,
  GeolocationErrorEvent,
  PositionEvent
} from './position-events';

export type {
  DeliveryBaseEvent,
  DeliveryCreatedEvent,
  DeliveryUpdatedEvent,
  DeliveryAssignedEvent,
  DeliveryStatusChangedEvent,
  DeliveryCompletedEvent,
  DeliveryCancelledEvent,
  DeliveryProblemEvent,
  ProofOfDeliveryEvent,
  DeliveryEvent
} from './delivery-events';

export type {
  LivreurBaseEvent,
  LivreurStatusChangedEvent,
  LivreurLocationUpdateEvent,
  LivreurAssignedEvent,
  LivreurAvailableEvent,
  LivreurOfflineEvent,
  LivreurShiftStartedEvent,
  LivreurShiftEndedEvent,
  LivreurAlertEvent,
  LivreurEvent,
  LivreurAlertType
} from './livreur-events';
