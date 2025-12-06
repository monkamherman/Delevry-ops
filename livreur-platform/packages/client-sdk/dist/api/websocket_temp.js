"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const events_1 = require("events");
class WebSocketClient {
    constructor(config) {
        this.socket = null;
        this.eventEmitter = new events_1.EventEmitter();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.connectionTimeout = null;
        this.pingInterval = null;
        this.lastPing = 0;
        this.latency = 0;
        // Configuration par défaut
        this.config = {
            autoConnect: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            debug: false,
            token: '',
            ...config,
        };
        this.maxReconnectAttempts = this.config.reconnectionAttempts;
        this.reconnectDelay = this.config.reconnectionDelay;
        if (this.config.autoConnect) {
            this.connect();
        }
    }
    /**
     * Établit une connexion WebSocket
     */
    connect() {
        var _a;
        if ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected) {
            return;
        }
        this.socket = (0, socket_io_client_1.io)(this.config.url, {
            transports: ['websocket'],
            auth: {
                token: this.config.token,
            },
            reconnection: false, // Géré manuellement
            timeout: this.config.timeout,
        });
        this.setupEventListeners();
    }
    /**
     * Déconnecte le client WebSocket
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.cleanup();
        }
    }
    /**
     * Vérifie si le client est connecté
     */
    isConnectedToServer() {
        return this.isConnected;
    }
    /**
     * Définit le token d'authentification
     */
    setToken(token) {
        this.config.token = token;
        if (this.socket) {
            this.socket.auth = { token };
            if (this.isConnected) {
                // Se reconnecter avec le nouveau token
                this.socket.disconnect().connect();
            }
        }
    }
    /**
     * Écoute un événement du serveur
     */
    on(event, listener) {
        // @ts-ignore - La signature de type est plus stricte que nécessaire
        this.eventEmitter.on(event, listener);
    }
    /**
     * Arrête d'écouter un événement
     */
    off(event, listener) {
        // @ts-ignore - La signature de type est plus stricte que nécessaire
        this.eventEmitter.off(event, listener);
    }
    /**
     * Envoie un événement au serveur
     */
    emit(event, ...args) {
        if (!this.socket || !this.isConnected) {
            this.log('warn', `Tentative d'émission alors que non connecté: ${String(event)}`);
            return;
        }
        // @ts-ignore - La signature de type est plus stricte que nécessaire
        this.socket.emit(event, ...args);
    }
    /**
     * Obtient la latence actuelle en millisecondes
     */
    getLatency() {
        return this.latency;
    }
    // Méthodes privées
    /**
     * Journalisation des événements
     */
    log(level, message, data) {
        if (!this.config.debug && level === 'debug')
            return;
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        switch (level) {
            case 'error':
                console.error(logMessage, data || '');
                break;
            case 'warn':
                console.warn(logMessage, data || '');
                break;
            case 'info':
                console.info(logMessage, data || '');
                break;
            case 'debug':
                console.debug(logMessage, data || '');
                break;
        }
    }
    /**
     * Configure les écouteurs d'événements du socket
     */
    setupEventListeners() {
        if (!this.socket)
            return;
        // Gestion de la connexion
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.log('info', 'Connecté au serveur WebSocket');
            this.eventEmitter.emit('connect');
            this.startPingPong();
        });
        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            this.log('warn', `Déconnecté du serveur: ${reason}`);
            this.eventEmitter.emit('disconnect', reason);
            this.stopPingPong();
            // Tentative de reconnexion automatique
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
                this.log('info', `Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms...`);
                this.connectionTimeout = setTimeout(() => {
                    this.connect();
                }, Math.min(delay, 30000)); // Max 30s de délai
            }
            else {
                this.log('error', `Échec de la reconnexion après ${this.maxReconnectAttempts} tentatives`);
                this.eventEmitter.emit('reconnect_failed');
            }
        });
        this.socket.on('connect_error', (error) => {
            const socketError = error;
            this.log('error', `Erreur de connexion: ${socketError.message}`, socketError);
            this.eventEmitter.emit('connect_error', error);
        });
        // Configuration des gestionnaires d'événements
        this.setupEventHandlers();
    }
    /**
     * Configure les gestionnaires d'événements métier
     */
    setupEventHandlers() {
        if (!this.socket)
            return;
        // Gestion des mises à jour de position
        this.socket.on('position:update', (data) => {
            this.log('debug', 'Mise à jour de position reçue', data);
            this.eventEmitter.emit('position:update', data);
        });
        // Gestion des statuts de livraison
        this.socket.on('delivery:status', (data) => {
            this.log('debug', 'Mise à jour du statut de livraison', data);
            this.eventEmitter.emit('delivery:status', data);
        });
        // Gestion des livraisons assignées
        this.socket.on('delivery:assigned', (data) => {
            this.log('info', 'Livraison assignée', data);
            this.eventEmitter.emit('delivery:assigned', data);
        });
        // Gestion des pongs pour la mesure de latence
        this.socket.on('pong', (latency) => {
            this.latency = latency;
            this.eventEmitter.emit('pong', latency);
        });
        // Gestion des erreurs
        this.socket.on('error', (error) => {
            this.log('error', 'Erreur WebSocket', error);
            this.eventEmitter.emit('error', error);
        });
        // Gestion des reconnexions
        this.socket.on('reconnect', (attempt) => {
            this.log('info', `Tentative de reconnexion ${attempt}`);
            this.eventEmitter.emit('reconnect', attempt);
        });
        this.socket.on('reconnect_attempt', (attempt) => {
            this.log('info', `Tentative de reconnexion en cours (${attempt})`);
            this.eventEmitter.emit('reconnect_attempt', attempt);
        });
        this.socket.on('reconnect_error', (error) => {
            this.log('error', 'Erreur lors de la reconnexion', error);
            this.eventEmitter.emit('reconnect_error', error);
        });
        this.socket.on('reconnect_failed', () => {
            this.log('error', 'Échec de la reconnexion après plusieurs tentatives');
            this.eventEmitter.emit('reconnect_failed');
        });
    }
    /**
     * Démarre le mécanisme de ping/pong pour maintenir la connexion active
     */
    startPingPong() {
        if (this.pingInterval)
            return;
        this.pingInterval = setInterval(() => {
            var _a;
            if (!((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected))
                return;
            this.lastPing = Date.now();
            this.socket.emit('ping', this.lastPing);
            // Vérifie si on a reçu un pong dans les 10 secondes
            setTimeout(() => {
                var _a, _b;
                if (this.lastPing > 0 && Date.now() - this.lastPing > 10000) {
                    this.log('warn', 'Pas de réponse pong du serveur, reconnexion...');
                    (_a = this.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
                    (_b = this.socket) === null || _b === void 0 ? void 0 : _b.connect();
                }
            }, 10000);
        }, 30000); // Ping toutes les 30 secondes
    }
    /**
     * Arrête le mécanisme de ping/pong
     */
    stopPingPong() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        this.lastPing = 0;
    }
    /**
     * Nettoie les ressources
     */
    cleanup() {
        this.stopPingPong();
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout);
            this.connectionTimeout = null;
        }
        if (this.socket) {
            this.socket.off();
            this.socket.disconnect();
            this.socket = null;
        }
    }
    // Méthodes utilitaires pour les événements métier
    /**
     * Met à jour la position du livreur
     */
    updatePosition(position) {
        this.emit('position:update', {
            lat: position.lat,
            lng: position.lng,
            accuracy: position.accuracy,
            timestamp: new Date().toISOString(),
        });
    }
    /**
     * Met à jour le statut du livreur
     */
    updateStatus(status) {
        this.emit('livreur:status', { status });
    }
    /**
     * Accepte une livraison
     */
    acceptDelivery(deliveryId) {
        this.emit('delivery:accept', deliveryId);
    }
    /**
     * Rejette une livraison
     */
    rejectDelivery(deliveryId, reason) {
        this.emit('delivery:reject', deliveryId, reason || '');
    }
    /**
     * Démarre une livraison
     */
    startDelivery(deliveryId) {
        this.emit('delivery:start', deliveryId);
    }
    /**
     * Marque une livraison comme terminée
     */
    completeDelivery(deliveryId, data) {
        this.emit('delivery:complete', deliveryId, data || {});
    }
    /**
     * Signale un échec de livraison
     */
    failDelivery(deliveryId, reason) {
        this.emit('delivery:fail', deliveryId, reason);
    }
    /**
     * S'abonne aux mises à jour d'une livraison
     */
    subscribeToDelivery(deliveryId) {
        this.emit('subscribe:delivery', { deliveryId });
    }
    /**
     * Se désabonne des mises à jour d'une livraison
     */
    unsubscribeFromDelivery(deliveryId) {
        this.emit('unsubscribe:delivery', { deliveryId });
    }
    /**
     * S'abonne aux mises à jour d'un livreur
     */
    subscribeToLivreur(livreurId) {
        this.emit('subscribe:livreur', { livreurId });
    }
    /**
     * Se désabonne des mises à jour d'un livreur
     */
    unsubscribeFromLivreur(livreurId) {
        this.emit('unsubscribe:livreur', { livreurId });
    }
}
exports.WebSocketClient = WebSocketClient;
exports.default = WebSocketClient;
