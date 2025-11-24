import { Position } from './models/position';
import { Livreur } from './models/livreur';
import { DeliveryStatus } from './enums';
/**
 * Événements émis par le serveur vers les clients
 */
export interface ServerToClientEvents {
    /**
     * Mise à jour de la position d'un livreur
     */
    position_updated: (data: {
        livreurId: string;
        position: Position;
        timestamp: string;
    }) => void;
    /**
     * Mise à jour du statut d'une livraison
     */
    delivery_status_updated: (data: {
        deliveryId: string;
        status: DeliveryStatus;
        updatedAt: string;
        livreurId?: string;
    }) => void;
    /**
     * Notification pour l'administrateur
     */
    admin_notification: (data: {
        type: 'new_delivery' | 'system_alert' | 'error';
        message: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
    }) => void;
}
/**
 * Événements émis par les clients vers le serveur
 */
export interface ClientToServerEvents {
    /**
     * Un livreur envoie sa position
     */
    update_position: (position: Position, callback: (response: {
        success: boolean;
        message?: string;
    }) => void) => void;
    /**
     * Un client s'abonne aux mises à jour d'une livraison
     */
    subscribe_to_delivery: (deliveryId: string, callback: (response: {
        success: boolean;
        message?: string;
    }) => void) => void;
    /**
     * Un administrateur s'abonne aux notifications
     */
    admin_subscribe: (callback: (response: {
        success: boolean;
    }) => void) => void;
}
/**
 * Événements inter-serveurs (pour le scaling)
 */
export interface InterServerEvents {
    ping: () => void;
    disconnect: (reason: string) => void;
}
/**
 * Données de socket
 */
export interface SocketData {
    userId?: string;
    role?: string;
    livreurId?: string;
    clientId?: string;
    adminId?: string;
}
/**
 * Types d'événements pour le système de suivi en temps réel
 */
export type TrackingEvent = {
    type: 'POSITION_UPDATE';
    data: {
        livreurId: string;
        position: Position;
    };
} | {
    type: 'DELIVERY_ASSIGNED';
    data: {
        deliveryId: string;
        livreur: Pick<Livreur, 'id' | 'firstName' | 'lastName'>;
    };
} | {
    type: 'DELIVERY_STATUS_CHANGED';
    data: {
        deliveryId: string;
        status: DeliveryStatus;
    };
};
/**
 * Payload pour les notifications
 */
export interface NotificationPayload {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    metadata?: Record<string, unknown>;
    read: boolean;
}
