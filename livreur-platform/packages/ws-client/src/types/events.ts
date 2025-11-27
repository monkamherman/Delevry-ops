import { WebSocketEvent } from './websocket-types';

// Réexport des types d'événements
export * from './websocket-types';

// Types d'événements personnalisés
export interface CustomEventMap {
  // Ajoutez ici des événements personnalisés si nécessaire
  [key: string]: any;
}

// Type combiné pour tous les événements
export type AllEventMap = CustomEventMap & {
  // Événements système
  'connected': void;
  'disconnected': { code?: number; reason?: string };
  'status': string;
  'error': Error;
  'message': WebSocketEvent;
};
