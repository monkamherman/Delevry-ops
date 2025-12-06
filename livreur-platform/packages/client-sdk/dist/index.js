"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivreurSDK = void 0;
// Export des types
__exportStar(require("./types"), exports);
// Export des erreurs
__exportStar(require("./errors"), exports);
// Export des clients
__exportStar(require("./api/httpClient"), exports);
__exportStar(require("./api/websocket"), exports);
/**
 * Classe principale du SDK
 */
class LivreurSDK {
    constructor(config) {
        // Configuration par défaut
        this.config = {
            ...config,
            wsUrl: config.wsUrl || config.apiUrl.replace(/^http/, 'ws'),
            options: {
                debug: false,
                noCache: false,
                timeout: 30000,
                ...config.options,
            },
        };
        // Initialisation du client HTTP
        this.http = new (require('./api/httpClient').HttpClient)({
            baseURL: this.config.apiUrl,
            token: this.config.token,
            timeout: this.config.options.timeout,
            headers: {
                'Cache-Control': this.config.options.noCache ? 'no-cache, no-store' : 'no-cache',
            },
        });
        // Initialisation du client WebSocket si l'URL est fournie
        if (this.config.wsUrl) {
            this.ws = new (require('./api/websocket').WebSocketClient)({
                url: this.config.wsUrl,
                token: this.config.token,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000,
            });
        }
        // Configuration des logs de débogage
        if (this.config.options.debug) {
            this.setupDebugLogging();
        }
    }
    /**
     * Initialise une instance unique du SDK (Singleton)
     */
    static getInstance(config) {
        if (!LivreurSDK.instance && config) {
            LivreurSDK.instance = new LivreurSDK(config);
        }
        else if (!LivreurSDK.instance) {
            throw new Error('SDK non initialisé. Appelez getInstance avec une configuration.');
        }
        return LivreurSDK.instance;
    }
    /**
     * Configure le token d'authentification
     */
    setToken(token) {
        this.config.token = token || '';
        this.http.setToken(token);
        if (this.ws) {
            if (token) {
                this.ws.setToken(token);
            }
            else {
                this.ws.disconnect();
            }
        }
    }
    /**
     * Récupère le client HTTP
     */
    getHttpClient() {
        return this.http;
    }
    /**
     * Récupère le client WebSocket
     */
    getWebSocketClient() {
        return this.ws;
    }
    /**
     * Active ou désactive les logs de débogage
     */
    setDebug(enabled) {
        this.config.options.debug = enabled;
        if (enabled) {
            this.setupDebugLogging();
        }
        else {
            // Désactiver les logs si nécessaire
        }
    }
    /**
     * Configure les logs de débogage
     */
    setupDebugLogging() {
        // Log des requêtes HTTP
        const httpClient = this.getHttpClient();
        // @ts-ignore - Accès à l'instance axios interne
        const axiosInstance = httpClient.client;
        axiosInstance.interceptors.request.use(config => {
            console.log('[HTTP Request]', {
                url: config.url,
                method: config.method,
                params: config.params,
                data: config.data,
            });
            return config;
        });
        axiosInstance.interceptors.response.use(response => {
            console.log('[HTTP Response]', {
                url: response.config.url,
                status: response.status,
                data: response.data,
            });
            return response;
        }, error => {
            var _a, _b, _c;
            console.error('[HTTP Error]', {
                url: (_a = error.config) === null || _a === void 0 ? void 0 : _a.url,
                status: (_b = error.response) === null || _b === void 0 ? void 0 : _b.status,
                message: error.message,
                response: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
            });
            return Promise.reject(error);
        });
        // Log des événements WebSocket
        if (this.ws) {
            const events = [
                'connect', 'disconnect', 'connect_error', 'error',
                'position:update', 'delivery:status', 'delivery:assigned',
                'livreur:status', 'notification:new', 'route:update'
            ];
            events.forEach(event => {
                var _a;
                // @ts-ignore
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.on(event, (data) => {
                    console.log(`[WebSocket ${String(event)}]`, data);
                });
            });
        }
    }
}
exports.LivreurSDK = LivreurSDK;
// Export par défaut pour une utilisation simplifiée
exports.default = LivreurSDK.getInstance;
