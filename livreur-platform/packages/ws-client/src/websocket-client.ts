import ReconnectingWebSocket from 'reconnecting-websocket';
import { EventEmitter } from 'events';
import {
  WebSocketEvent,
  WebSocketEventType,
  WebSocketStatus,
  WebSocketError,
  WebSocketEventMap,
  PositionUpdateEvent,
  StatusUpdateEvent,
  DeliveryAssignedEvent,
  DeliveryCompletedEvent,
  WebSocketOptions
} from './types';

/**
 * Client WebSocket pour la communication en temps réel avec le serveur de suivi
 */
export class LivreurWebSocketClient extends EventEmitter {
  private ws: ReconnectingWebSocket | null = null;
  private url: string;
  private options: Required<WebSocketOptions>;
  private status: WebSocketStatus = WebSocketStatus.DISCONNECTED;
  private reconnectAttempts = 0;
  private messageQueue: string[] = [];

  constructor(url: string, options: WebSocketOptions = {}) {
    super();
    this.url = url;
    this.options = {
      reconnectInterval: options.reconnectInterval ?? 1000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 10,
      debug: options.debug ?? false,
      autoReconnect: options.autoReconnect ?? true,
    };
  }

  /**
   * Établit la connexion WebSocket
   */
  public connect(): void {
    if (this.ws) {
      this.log('WebSocket déjà connecté ou en cours de connexion');
      return;
    }

    try {
      this.ws = new ReconnectingWebSocket(this.url, [], {
        connectionTimeout: 5000,
        maxRetries: this.options.maxReconnectAttempts,
        minReconnectionDelay: this.options.reconnectInterval,
        maxReconnectionDelay: this.options.reconnectInterval * 2,
      });

      this.setStatus(WebSocketStatus.CONNECTING);

      this.ws.onopen = () => this.handleOpen();
      this.ws.onclose = (event: CloseEvent) => this.handleClose(event);
      this.ws.onmessage = (event: MessageEvent) => this.handleMessage(event);
      this.ws.onerror = (error: Event) => this.handleError(error);

    } catch (error) {
      const errorEvent: WebSocketError = {
        type: 'connection_error',
        message: `Erreur lors de la connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        error: error instanceof Error ? error : new Error('Erreur de connexion inconnue')
      };
      this.emit('error', errorEvent);
      this.setStatus(WebSocketStatus.ERROR);
    }
  }

  /**
   * Gère la fermeture de la connexion
   */
  private handleClose(event: CloseEvent): void {
    this.log(`Connexion fermée: ${event.code} ${event.reason || 'Aucune raison fournie'}`);
    
    if (this.status !== WebSocketStatus.DISCONNECTED) {
      if (this.options.autoReconnect && this.reconnectAttempts < this.options.maxReconnectAttempts) {
        this.reconnectAttempts++;
        this.setStatus(WebSocketStatus.RECONNECTING);
        this.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.options.maxReconnectAttempts}...`);
      } else {
        this.setStatus(WebSocketStatus.DISCONNECTED);
        this.emit('disconnected', { code: event.code, reason: event.reason });
      }
    }
  }

  /**
   * Gère les messages entrants du WebSocket
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data) as WebSocketEvent;
      
      // Émet l'événement générique 'message'
      this.emit('message', message);
      
      // Émet un événement spécifique au type de message
      switch (message.type) {
        case 'position_update':
          this.emit('position_update', message.data as PositionUpdateEvent);
          break;
        case 'status_update':
          this.emit('status_update', message.data as StatusUpdateEvent);
          break;
        case 'delivery_assigned':
          this.emit('delivery_assigned', message.data as DeliveryAssignedEvent);
          break;
        case 'delivery_completed':
          this.emit('delivery_completed', message.data as DeliveryCompletedEvent);
          break;
        case 'error':
          this.emit('websocket_error', message.data as WebSocketError);
          break;
        default:
          this.log(`Type de message non géré: ${message.type}`);
      }
    } catch (error) {
      const errorEvent: WebSocketError = {
        type: 'message_error',
        message: 'Erreur lors du traitement du message',
        error: error instanceof Error ? error : new Error('Erreur inconnue')
      };
      this.emit('error', errorEvent);
    }
  }

  /**
   * Gère les erreurs de connexion
   */
  private handleError(error: Event): void {
    const errorEvent: WebSocketError = {
      type: 'websocket_error',
      message: 'Erreur de connexion WebSocket',
      error: error instanceof Error ? error : new Error('Erreur WebSocket inconnue'),
    };
    this.emit('error', errorEvent);
    this.setStatus(WebSocketStatus.ERROR);
  }

  /**
   * Vide la file d'attente des messages
   */
  private flushMessageQueue(): void {
    if (!this.ws || this.messageQueue.length === 0) {
      return;
    }

    this.log(`Vidage de la file d'attente (${this.messageQueue.length} messages)`);
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(message);
      }
    }
  }

  /**
   * Met à jour le statut de la connexion
   */
  private setStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.emit('status', status);
      this.log(`Statut: ${status}`);
    }
  }

  /**
   * Journalisation des événements en mode debug
   */
  private log(message: string): void {
    if (this.options.debug) {
      console.log(`[LivreurWebSocket] ${message}`);
    }
  }

  /**
   * Retourne le statut actuel de la connexion
   */
  public getStatus(): WebSocketStatus {
    return this.status;
  }
}

// Exporte une instance par défaut pour une utilisation simple
export const createWebSocketClient = (
  url: string, 
  options: WebSocketOptions = {}
): LivreurWebSocketClient => {
  return new LivreurWebSocketClient(url, options);
};
