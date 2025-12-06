// Export des types
export * from "./types";

// Export des erreurs
export * from "./errors";

// Export des clients
export * from "./api/httpClient";
export * from "./api/websocket";

// Export des utilitaires
// (à compléter avec les utilitaires spécifiques au SDK)

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
export class LivreurSDK {
  private static instance: LivreurSDK;
  private config: LivreurSDKConfig;
  private http!: import("./api/httpClient").HttpClient;
  private ws?: import("./api/websocket").WebSocketClient;

  private constructor(config: LivreurSDKConfig) {
    // Configuration par défaut
    this.config = {
      ...config,
      wsUrl: config.wsUrl || config.apiUrl.replace(/^http/, "ws"),
      token: config.token || "",
      options: {
        debug: false,
        noCache: false,
        timeout: 30000,
        ...config.options,
      },
    };

    // Initialisation asynchrone des clients
    this.initializeClients().catch((error) => {
      console.error("Erreur lors de l'initialisation du SDK:", error);
    });

    // Configuration des logs de débogage
    if (this.config.options?.debug) {
      this.setupDebugLogging();
    }
  }

  /**
   * Initialise les clients HTTP et WebSocket
   */
  private async initializeClients(): Promise<void> {
    // Initialisation du client HTTP avec import dynamique
    const httpModule = await import("./api/httpClient");
    this.http = new httpModule.HttpClient({
      baseURL: this.config.apiUrl,
      token: this.config.token,
      timeout: this.config.options?.timeout,
      headers: {
        "Cache-Control": this.config.options?.noCache
          ? "no-cache, no-store"
          : "no-cache",
      },
    });

    // Initialisation du client WebSocket si l'URL est fournie
    if (this.config.wsUrl) {
      const wsModule = await import("./api/websocket");
      this.ws = new wsModule.WebSocketClient({
        url: this.config.wsUrl,
        token: this.config.token,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });
    }
  }

  /**
   * Initialise une instance unique du SDK (Singleton)
   */
  public static getInstance(config?: LivreurSDKConfig): LivreurSDK {
    if (!LivreurSDK.instance && config) {
      LivreurSDK.instance = new LivreurSDK(config);
    } else if (!LivreurSDK.instance) {
      throw new Error(
        "SDK non initialisé. Appelez getInstance avec une configuration."
      );
    }
    return LivreurSDK.instance;
  }

  /**
   * Configure le token d'authentification
   */
  public setToken(token: string | undefined): void {
    this.config.token = token || "";
    this.http.setToken(token);

    if (this.ws) {
      if (token) {
        this.ws.setToken(token);
      } else {
        this.ws.disconnect();
      }
    }
  }

  /**
   * Récupère le client HTTP
   */
  public getHttpClient(): import("./api/httpClient").HttpClient {
    return this.http;
  }

  /**
   * Récupère le client WebSocket
   */
  public getWebSocketClient():
    | import("./api/websocket").WebSocketClient
    | undefined {
    return this.ws;
  }

  /**
   * Active ou désactive les logs de débogage
   */
  public setDebug(enabled: boolean): void {
    if (this.config.options) {
      this.config.options.debug = enabled;
    } else {
      this.config.options = { debug: enabled };
    }

    if (enabled) {
      this.setupDebugLogging();
    } else {
      // Désactiver les logs si nécessaire
    }
  }

  /**
   * Configure les logs de débogage
   */
  private setupDebugLogging(): void {
    // Log des requêtes HTTP
    const httpClient = this.getHttpClient();

    // @ts-expect-error - Accès à l'instance axios interne
    const axiosInstance = httpClient.client;

    axiosInstance.interceptors.request.use((config) => {
      console.log("[HTTP Request]", {
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
      });
      return config;
    });

    axiosInstance.interceptors.response.use(
      (response) => {
        console.log("[HTTP Response]", {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("[HTTP Error]", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          response: error.response?.data,
        });
        return Promise.reject(error);
      }
    );

    // Log des événements WebSocket
    if (this.ws) {
      const events: (keyof import("./types/events").ServerToClientEvents)[] = [
        "connect",
        "disconnect",
        "connect_error",
        "error",
        "position:update",
        "delivery:status",
        "delivery:assigned",
        "livreur:status",
        "notification:new",
        "route:update",
      ];

      events.forEach((event) => {
        this.ws?.on(event, (data: unknown) => {
          console.log(`[WebSocket ${String(event)}]`, data);
        });
      });
    }
  }
}

// Export par défaut pour une utilisation simplifiée
export default LivreurSDK.getInstance;
