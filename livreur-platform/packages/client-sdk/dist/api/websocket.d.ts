import { ClientToServerEvents, ServerToClientEvents } from "../types/events";
interface LivreurPosition {
    lat: number;
    lng: number;
    accuracy?: number;
    status?: string;
    timestamp?: string;
}
export interface WebSocketConfig {
    /** URL du serveur WebSocket */
    url: string;
    /** Token d'authentification (optionnel) */
    token?: string;
    /** Se connecter automatiquement */
    autoConnect?: boolean;
    /** Nombre de tentatives de reconnexion */
    reconnectionAttempts?: number;
    /** Délai entre les tentatives de reconnexion (ms) */
    reconnectionDelay?: number;
    /** Délai d'attente de connexion (ms) */
    timeout?: number;
    /** Activer les logs de débogage */
    debug?: boolean;
}
export declare class WebSocketClient {
    private socket;
    private config;
    private eventEmitter;
    private isConnected;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    private connectionTimeout;
    private pingInterval;
    private lastPing;
    private latency;
    private debug;
    constructor(config: WebSocketConfig);
    /**
     * Établit une connexion WebSocket
     */
    connect(): void;
    /**
     * Déconnecte le client WebSocket
     */
    disconnect(): void;
    /**
     * Vérifie si le client est connecté
     */
    connected(): boolean;
    /**
     * Envoie un événement au serveur
     */
    emit<K extends keyof ClientToServerEvents>(event: K, ...args: Parameters<ClientToServerEvents[K]>): void;
    /**
     * S'abonne à un événement du serveur
     */
    on<K extends keyof ServerToClientEvents>(event: K, handler: ServerToClientEvents[K]): void;
    /**
     * Se désabonne d'un événement
     */
    off<K extends keyof ServerToClientEvents>(event: K, handler: ServerToClientEvents[K]): void;
    /**
     * Met à jour le token d'authentification
     */
    setToken(token: string): void;
    /**
     * Obtient la latence actuelle en millisecondes
     */
    getLatency(): number;
    /**
     * Journalisation des événements
     */
    private log;
    /**
     * Démarre le mécanisme de ping/pong pour maintenir la connexion active
     */
    private startPingPong;
    /**
     * Arrête le mécanisme de ping/pong
     */
    private stopPingPong;
    /**
     * Nettoie les ressources
     */
    private cleanup;
    /**
     * Configure un gestionnaire d'événement avec typage sécurisé
     */
    private setupEventHandler;
    /**
     * Configure les écouteurs d'événements du socket
     */
    private setupEventListeners;
    /**
     * Configure les gestionnaires d'événements métier
     */
    private setupEventHandlers;
    /**
     * Configure le système de ping/pong pour surveiller la connexion
     */
    private setupPingPong;
    /**
     * Met à jour la position du livreur
     */
    updatePosition(position: LivreurPosition): void;
    /**
     * Met à jour le statut du livreur
     */
    updateStatus(status: string): void;
    /**
     * S'abonne aux mises à jour d'une livraison
     */
    subscribeToDelivery(deliveryId: string): void;
    /**
     * Se désabonne des mises à jour d'une livraison
     */
    unsubscribeFromDelivery(deliveryId: string): void;
    /**
     * Accepte une livraison
     */
    acceptDelivery(deliveryId: string): void;
    /**
     * Rejette une livraison
     */
    rejectDelivery(deliveryId: string, reason?: string): void;
    /**
     * Démarre une livraison
     */
    startDelivery(deliveryId: string): void;
    /**
     * Marque une livraison comme terminée
     */
    completeDelivery(deliveryId: string, data?: unknown): void;
    /**
     * Signale un échec de livraison
     */
    failDelivery(deliveryId: string, reason: string): void;
}
export {};
