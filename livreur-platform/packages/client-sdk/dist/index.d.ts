export * from './types';
export * from './errors';
export * from './api/httpClient';
export * from './api/websocket';
/**
 * Configuration du client SDK
 */
export interface LivreurSDKConfig {
    /** URL de base de l'API REST */
    apiUrl: string;
    /** URL du serveur WebSocket */
    wsUrl?: string;
    /** Token d'authentification (optionnel) */
    token?: string;
    /** Options supplémentaires */
    options?: {
        /** Activer les logs de débogage */
        debug?: boolean;
        /** Désactiver le cache par défaut */
        noCache?: boolean;
        /** Délai d'attente des requêtes en millisecondes */
        timeout?: number;
    };
}
/**
 * Classe principale du SDK
 */
export declare class LivreurSDK {
    private static instance;
    private config;
    private http;
    private ws?;
    private constructor();
    /**
     * Initialise une instance unique du SDK (Singleton)
     */
    static getInstance(config?: LivreurSDKConfig): LivreurSDK;
    /**
     * Configure le token d'authentification
     */
    setToken(token: string | undefined): void;
    /**
     * Récupère le client HTTP
     */
    getHttpClient(): import('./api/httpClient').HttpClient;
    /**
     * Récupère le client WebSocket
     */
    getWebSocketClient(): import('./api/websocket').WebSocketClient | undefined;
    /**
     * Active ou désactive les logs de débogage
     */
    setDebug(enabled: boolean): void;
    /**
     * Configure les logs de débogage
     */
    private setupDebugLogging;
}
declare const _default: typeof LivreurSDK.getInstance;
export default _default;
