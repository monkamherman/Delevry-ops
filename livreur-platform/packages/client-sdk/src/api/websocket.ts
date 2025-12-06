import { EventEmitter } from "events";
import { io, Socket } from "socket.io-client";
// Import des types de position depuis les types communs
import { LivreurPosition } from "../types/common";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketError,
} from "../types/events";

// Le type EventHandler a été supprimé car non utilisé dans la version finale

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

export class WebSocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;
  private config: Required<WebSocketConfig>;
  private eventEmitter = new EventEmitter();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private lastPing = 0;
  private latency = 0;
  private debug: boolean;

  constructor(config: WebSocketConfig) {
    // Configuration par défaut
    this.config = {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      debug: false,
      token: "",
      ...config,
    } as Required<WebSocketConfig>;

    this.maxReconnectAttempts = this.config.reconnectionAttempts;
    this.reconnectDelay = this.config.reconnectionDelay;
    this.debug = this.config.debug;

    if (this.config.autoConnect) {
      this.connect();
    }
  }

  /**
   * Établit une connexion WebSocket
   */
  public connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.config.url, {
      auth: this.config.token ? { token: this.config.token } : undefined,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: this.config.timeout,
      autoConnect: true,
      transports: ["websocket"],
    });

    this.setupEventListeners();
    this.setupPingPong();
  }

  /**
   * Déconnecte le client WebSocket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.cleanup();
    }
  }

  /**
   * Vérifie si le client est connecté
   */
  public connected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Envoie un événement au serveur
   */
  public emit<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): void {
    if (!this.connected()) {
      console.warn("WebSocket non connecté, tentative de reconnexion...");
      this.connect();
      // Vous pourriez vouloir mettre en file d'attente les événements en cas de déconnexion
      return;
    }

    if (!this.socket) return;

    // Utilisation d'une assertion de type plus sûre
    const emit = this.socket.emit as <E extends keyof ClientToServerEvents>(
      event: E,
      ...args: Parameters<ClientToServerEvents[E]>
    ) => void;

    emit(event, ...args);
  }

  /**
   * S'abonne à un événement du serveur
   */
  public on<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    this.eventEmitter.on(
      event as string,
      handler as (...args: unknown[]) => void
    );
  }

  /**
   * Se désabonne d'un événement
   */
  public off<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    this.eventEmitter.off(
      event as string,
      handler as (...args: unknown[]) => void
    );
  }

  /**
   * Met à jour le token d'authentification
   */
  public setToken(token: string): void {
    this.config.token = token;
    if (this.socket) {
      this.socket.auth = { token };
      if (this.connected()) {
        this.socket.disconnect().connect();
      }
    }
  }

  /**
   * Obtient la latence actuelle en millisecondes
   */
  public getLatency(): number {
    return this.latency;
  }

  /**
   * Journalisation des événements
   */
  private log(
    level: "debug" | "info" | "warn" | "error",
    message: string,
    data?: unknown
  ): void {
    if (!this.debug && level === "debug") return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case "error":
        console.error(logMessage, data || "");
        break;
      case "warn":
        console.warn(logMessage, data || "");
        break;
      case "info":
        console.info(logMessage, data || "");
        break;
      case "debug":
        console.debug(logMessage, data || "");
        break;
    }
  }

  /**
   * Démarre le mécanisme de ping/pong pour maintenir la connexion active
   */
  private startPingPong(): void {
    if (this.pingInterval) return;

    this.pingInterval = setInterval(() => {
      if (!this.socket?.connected) return;

      this.lastPing = Date.now();
      this.socket.emit("ping", this.lastPing);

      // Vérifie si on a reçu un pong dans les 10 secondes
      setTimeout(() => {
        if (this.lastPing > 0 && Date.now() - this.lastPing > 10000) {
          this.log("warn", "Pas de réponse pong du serveur, reconnexion...");
          this.socket?.disconnect();
          this.socket?.connect();
        }
      }, 10000);
    }, 30000); // Ping toutes les 30 secondes
  }

  /**
   * Arrête le mécanisme de ping/pong
   */
  private stopPingPong(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.lastPing = 0;
  }

  /**
   * Nettoie les ressources
   */
  private cleanup(): void {
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

  // Méthodes privées

  /**
   * Configure un gestionnaire d'événement avec typage sécurisé
   */
  private setupEventHandler<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    if (!this.socket) return;

    // Enregistrement direct du gestionnaire avec cast approprié
    this.socket.on(event, handler as any);
  }

  /**
   * Configure les écouteurs d'événements du socket
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Gestion de la connexion
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.log("info", "Connecté au serveur WebSocket");
      this.eventEmitter.emit("connect");
      this.startPingPong();
    });

    this.socket.on("disconnect", (reason: string) => {
      this.isConnected = false;
      this.log("warn", `Déconnecté du serveur: ${reason}`);
      this.eventEmitter.emit("disconnect", reason);
      this.stopPingPong();

      // Tentative de reconnexion automatique
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay =
          this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        this.log(
          "info",
          `Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms...`
        );

        this.connectionTimeout = setTimeout(
          () => {
            this.connect();
          },
          Math.min(delay, 30000)
        ); // Max 30s de délai
      } else {
        this.log(
          "error",
          `Échec de la reconnexion après ${this.maxReconnectAttempts} tentatives`
        );
        this.eventEmitter.emit("reconnect_failed");
      }
    });

    this.socket.on("connect_error", (error: Error) => {
      const socketError = error as unknown as SocketError;
      this.log(
        "error",
        `Erreur de connexion: ${socketError.message}`,
        socketError
      );
      this.eventEmitter.emit("connect_error", error);
    });

    // Configuration des gestionnaires d'événements
    this.setupEventHandlers();
  }

  /**
   * Configure les gestionnaires d'événements métier
   */
  private setupEventHandlers(): void {
    // Gestion des mises à jour de position
    this.setupEventHandler("position:update", (position: LivreurPosition) => {
      this.log("debug", "Mise à jour de position reçue", position);
      this.eventEmitter.emit("position:update", position);
    });

    // Gestion des statuts de livraison
    this.setupEventHandler("delivery:status", (data: unknown) => {
      this.log("debug", "Mise à jour du statut de livraison", data);
      this.eventEmitter.emit("delivery:status", data);
    });

    // Gestion des livraisons assignées
    this.setupEventHandler("delivery:assigned", (data: unknown) => {
      this.log("info", "Livraison assignée", data);
      this.eventEmitter.emit("delivery:assigned", data);
    });

    // Gestion des livraisons désassignées
    this.setupEventHandler("delivery:unassigned", (deliveryId: unknown) => {
      this.log("info", "Livraison désassignée", deliveryId);
      this.eventEmitter.emit("delivery:unassigned", deliveryId);
    });

    // Gestion des mises à jour de statut du livreur
    this.setupEventHandler("livreur:status", (data: unknown) => {
      this.log("debug", "Mise à jour du statut du livreur", data);
      this.eventEmitter.emit("livreur:status", data);
    });

    // Gestion des nouvelles notifications
    this.setupEventHandler("notification:new", (notification: unknown) => {
      this.log("info", "Nouvelle notification", notification);
      this.eventEmitter.emit("notification:new", notification);
    });

    // Gestion des mises à jour d'itinéraire
    this.setupEventHandler("route:update", (route: unknown) => {
      this.log("debug", "Mise à jour de la route", route);
      this.eventEmitter.emit("route:update", route);
    });

    // Gestion des pongs pour la mesure de latence
    this.setupEventHandler("pong", (latency: unknown) => {
      if (typeof latency === "number") {
        this.latency = latency;
        this.eventEmitter.emit("pong", latency);
      }
    });

    // Gestion des erreurs
    this.setupEventHandler("error", (error: unknown) => {
      this.log("error", "Erreur WebSocket", error);
      this.eventEmitter.emit("error", error);
    });

    // Gestion des reconnexions
    this.setupEventHandler("reconnect", (attempt: unknown) => {
      this.log("info", `Tentative de reconnexion ${attempt}`);
      this.eventEmitter.emit("reconnect", attempt);
    });

    this.setupEventHandler("reconnect_attempt", (attempt: unknown) => {
      this.log("info", `Tentative de reconnexion en cours (${attempt})`);
      this.eventEmitter.emit("reconnect_attempt", attempt);
    });

    this.setupEventHandler("reconnect_error", (error: unknown) => {
      this.log("error", "Erreur lors de la reconnexion", error);
      this.eventEmitter.emit("reconnect_error", error);
    });

    this.setupEventHandler("reconnect_failed", () => {
      this.log("error", "Échec de la reconnexion après plusieurs tentatives");
      this.eventEmitter.emit("reconnect_failed");
    });
  }

  /**
   * Configure le système de ping/pong pour surveiller la connexion
   */
  private setupPingPong(): void {
    if (!this.socket) return;

    this.socket.on("pong", (latency: number) => {
      this.latency = latency;
      this.log("debug", `Latence: ${latency}ms`);
    });

    // Démarrer l'envoi périodique de pings
    this.startPingPong();
  }

  // ======================
  // Méthodes métier
  // ======================

  /**
   * Met à jour la position du livreur
   */
  public updatePosition(position: LivreurPosition): void {
    this.emit("position:update", {
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy,
      timestamp: position.timestamp,
    });
  }

  /**
   * Met à jour le statut du livreur
   */
  public updateStatus(status: string): void {
    if (!this.socket) return;

    // Création d'un objet de position avec le statut
    const position: LivreurPosition = {
      lat: 0, // Ces valeurs devraient être fournies par l'appelant
      lng: 0, // Ces valeurs devraient être fournies par l'appelant
      status,
      timestamp: new Date().toISOString(),
    };

    // Émission de l'événement avec le type correct
    this.emit("position:update", {
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy,
      timestamp: position.timestamp,
    });
  }

  /**
   * S'abonne aux mises à jour d'une livraison
   */
  public subscribeToDelivery(deliveryId: string): void {
    this.emit("subscribe:delivery", { deliveryId });
  }

  /**
   * Se désabonne des mises à jour d'une livraison
   */
  public unsubscribeFromDelivery(deliveryId: string): void {
    this.emit("unsubscribe:delivery", { deliveryId });
  }

  /**
   * Accepte une livraison
   */
  public acceptDelivery(deliveryId: string): void {
    this.emit("delivery:accept", deliveryId);
  }

  /**
   * Rejette une livraison
   */
  public rejectDelivery(deliveryId: string, reason?: string): void {
    this.emit("delivery:reject", deliveryId, reason || "");
  }

  /**
   * Démarre une livraison
   */
  public startDelivery(deliveryId: string): void {
    this.emit("delivery:start", deliveryId);
  }

  /**
   * Marque une livraison comme terminée
   */
  public completeDelivery(deliveryId: string, data?: unknown): void {
    this.emit("delivery:complete", deliveryId, data || {});
  }

  /**
   * Signale un échec de livraison
   */
  public failDelivery(deliveryId: string, reason: string): void {
    this.emit("delivery:fail", deliveryId, reason);
  }
}
