import { Delivery, LivreurPosition } from './common';
/**
 * Types d'événements WebSocket émis par le serveur
 */
export interface ServerToClientEvents {
    connect: () => void;
    disconnect: (reason: string) => void;
    connect_error: (error: Error) => void;
    reconnect: (attempt: number) => void;
    reconnect_attempt: (attempt: number) => void;
    reconnect_error: (error: Error) => void;
    reconnect_failed: () => void;
    error: (error: Error) => void;
    'position:update': (position: LivreurPosition) => void;
    'delivery:status': (delivery: Delivery) => void;
    'delivery:assigned': (delivery: Delivery) => void;
    'delivery:unassigned': (deliveryId: string) => void;
    'livreur:status': (status: {
        livreurId: string;
        status: string;
    }) => void;
    'notification:new': (notification: Notification) => void;
    'route:update': (route: any) => void;
    'pong': (latency: number) => void;
}
/**
 * Types d'événements émis par le client
 */
export interface ClientToServerEvents {
    'position:update': (position: {
        lat: number;
        lng: number;
        accuracy?: number;
        timestamp?: string;
    }) => void;
    'delivery:accept': (deliveryId: string) => void;
    'delivery:reject': (deliveryId: string, reason?: string) => void;
    'delivery:start': (deliveryId: string) => void;
    'delivery:complete': (deliveryId: string, data?: any) => void;
    'delivery:fail': (deliveryId: string, reason: string) => void;
    'subscribe:delivery': (data: {
        deliveryId: string;
    }) => void;
    'unsubscribe:delivery': (data: {
        deliveryId: string;
    }) => void;
    'subscribe:livreur': (data: {
        livreurId: string;
    }) => void;
    'unsubscribe:livreur': (data: {
        livreurId: string;
    }) => void;
    'ping': (timestamp: number) => void;
}
/**
 * Interface pour les notifications
 */
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
    metadata?: {
        deliveryId?: string;
        livreurId?: string;
        [key: string]: any;
    };
}
/**
 * Interface pour les erreurs de socket
 */
export interface SocketError extends Error {
    code?: string;
    data?: any;
    timestamp?: string;
}
