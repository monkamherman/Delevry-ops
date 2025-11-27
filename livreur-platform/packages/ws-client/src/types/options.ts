/**
 * Options de configuration pour le client WebSocket
 */
export interface WebSocketOptions {
  /**
   * Délai avant de tenter une reconnexion (en ms)
   * @default 1000
   */
  reconnectInterval?: number;

  /**
   * Nombre maximum de tentatives de reconnexion
   * @default 10
   */
  maxReconnectAttempts?: number;

  /**
   * Active les logs de débogage
   * @default false
   */
  debug?: boolean;

  /**
   * Active la reconnexion automatique
   * @default true
   */
  autoReconnect?: boolean;

  /**
   * En-têtes HTTP supplémentaires pour la connexion WebSocket
   */
  headers?: Record<string, string>;

  /**
   * Paramètres de requête supplémentaires pour l'URL WebSocket
   */
  queryParams?: Record<string, string | number | boolean>;
}
