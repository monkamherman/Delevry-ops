import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClientConfig extends AxiosRequestConfig {
  /**
   * Délai maximum d'attente pour la requête en millisecondes
   * @default 30000 (30 secondes)
   */
  timeout?: number;

  /**
   * En-têtes HTTP personnalisés
   */
  headers?: Record<string, string>;

  /**
   * Nombre maximum de tentatives en cas d'échec
   * @default 3
   */
  maxRetries?: number;

  /**
   * Délai de base (en ms) pour le backoff exponentiel
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Fonction pour déterminer si une erreur doit déclencher une nouvelle tentative
   */
  shouldRetry?: (error: unknown) => boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpClientConfig;
}

export interface ApiError extends Error {
  config: HttpClientConfig;
  code?: string;
  status?: number;
  response?: AxiosResponse;
  isApiError: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  /**
   * Paramètres de requête (pour les requêtes GET)
   */
  params?: Record<string, any>;

  /**
   * Données à envoyer dans le corps de la requête (pour POST, PUT, PATCH)
   */
  data?: any;

  /**
   * En-têtes HTTP supplémentaires pour cette requête
   */
  headers?: Record<string, string>;

  /**
   * Timeout spécifique pour cette requête
   */
  timeout?: number;
}

/**
 * Configuration pour initialiser le client HTTP
 */
export interface HttpClientOptions {
  /**
   * URL de base de l'API
   * @example 'https://api.livreur.fr/v1'
   */
  baseURL: string;

  /**
   * Configuration par défaut pour toutes les requêtes
   */
  config?: Omit<HttpClientConfig, 'baseURL'>;

  /**
   * Fonction appelée avant chaque requête
   * Utile pour ajouter des en-têtes d'authentification
   */
  onRequest?: (config: HttpClientConfig) => Promise<HttpClientConfig>;

  /**
   * Fonction appelée en cas d'erreur
   */
  onError?: (error: ApiError) => void;
}
