import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import axiosRetry from 'axios-retry';
import { 
  HttpClientConfig, 
  HttpClientOptions, 
  ApiResponse, 
  ApiError, 
  HttpMethod, 
  RequestOptions 
} from './types';

/**
 * Classe de base pour le client HTTP
 */
export class HttpClient {
  private client: AxiosInstance;
  private readonly config: Omit<HttpClientConfig, 'shouldRetry'> & {
    shouldRetry: (error: unknown) => boolean;
    headers?: Record<string, string>;
  };
  private readonly onRequest?: (config: HttpClientConfig) => Promise<HttpClientConfig>;
  private readonly onError?: (error: ApiError) => void;

  constructor(options: HttpClientOptions) {
    // Configuration des en-têtes
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.config?.headers
    };
    
    // Création de la configuration finale
    this.config = {
      timeout: 30000, // 30 secondes par défaut
      maxRetries: 3,
      retryDelay: 1000,
      ...options.config,
      baseURL: options.baseURL,
      headers,
      shouldRetry: this.defaultShouldRetry.bind(this)
    };

    this.onRequest = options.onRequest;
    this.onError = options.onError;

    // Création de l'instance Axios
    this.client = axios.create(this.config);

    // Configuration des réessais automatiques
    this.setupRetry();

    // Configuration des intercepteurs
    this.setupInterceptors();
  }

  /**
   * Détermine si une erreur doit déclencher une nouvelle tentative
   */
  private defaultShouldRetry(error: unknown): boolean {
    const axiosError = error as AxiosError;
    
    // Ne pas réessayer les requêtes qui ont échoué avec ces codes
    const doNotRetryStatuses = [400, 401, 403, 404, 422];
    
    // Vérifier d'abord si c'est une erreur de timeout
    if (axiosError.code === 'ECONNABORTED') {
      return true;
    }
    
    // Vérifier les erreurs 5xx qui ne sont pas dans la liste noire
    if (axiosError.response) {
      const status = axiosError.response.status;
      return status >= 500 && !doNotRetryStatuses.includes(status);
    }
    
    // Par défaut, ne pas réessayer
    return false;
  }

  /**
   * Configure les réessais automatiques avec backoff exponentiel
   */
  private setupRetry(): void {
    // @ts-ignore - La signature de axios-retry n'est pas parfaitement typée
    axiosRetry(this.client, {
      retries: this.config.maxRetries ?? 3,
      retryDelay: (retryCount: number) => {
        // Backoff exponentiel avec un peu d'aléatoire
        const delay = Math.min(
          (this.config.retryDelay ?? 1000) * Math.pow(2, retryCount - 1),
          30000 // Maximum 30 secondes
        );
        // Ajout d'un peu d'aléatoire pour éviter le thundering herd
        return delay * (0.7 + Math.random() * 0.3);
      },
      retryCondition: (error: unknown) => {
        return this.config.shouldRetry(error);
      },
    });
  }

  /**
   * Configure les intercepteurs de requête et de réponse
   */
  private setupInterceptors(): void {
    // Intercepteur de requête
    this.client.interceptors.request.use(
      async (config) => {
        let updatedConfig: InternalAxiosRequestConfig = config;
        
        // Appel du hook onRequest si défini
        if (this.onRequest) {
          // Conversion des en-têtes vers le format attendu
          const requestHeaders: Record<string, string> = {};
          if (updatedConfig.headers) {
            const headers = updatedConfig.headers as Record<string, string>;
            Object.entries(headers).forEach(([key, value]) => {
              if (typeof value === 'string') {
                requestHeaders[key] = value;
              }
            });
          }
          
          const httpConfig: HttpClientConfig = {
            ...updatedConfig,
            headers: requestHeaders
          };
          
          const result = await this.onRequest(httpConfig);
          
          // Conversion des en-têtes de retour vers le format Axios
          const resultHeaders = new AxiosHeaders();
          if (result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => {
              if (typeof value === 'string') {
                resultHeaders.set(key, value);
              }
            });
          }
          
          updatedConfig = {
            ...result,
            headers: resultHeaders
          };
        }
        
        return updatedConfig;
      },
      (error) => {
        return Promise.reject(this.createApiError(error));
      }
    );

    // Intercepteur de réponse
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError = this.createApiError(error);
        
        // Appel du gestionnaire d'erreurs si défini
        if (this.onError) {
          this.onError(apiError);
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Crée une erreur API standardisée
   */
  private createApiError(error: unknown): ApiError {
    if (this.isApiError(error)) {
      return error;
    }

    const axiosError = error as AxiosError;
    const response = axiosError.response;
    
    const apiError: ApiError = {
      name: 'ApiError',
      message: axiosError.message || 'Une erreur inconnue est survenue',
      config: axiosError.config as HttpClientConfig,
      code: axiosError.code,
      status: response?.status,
      response: response,
      isApiError: true,
    };

    return apiError;
  }

  /**
   * Vérifie si une erreur est une ApiError
   */
  private isApiError(error: unknown): error is ApiError {
    return (error as ApiError).isApiError === true;
  }

  /**
   * Effectue une requête HTTP
   */
  public async request<T = any>(
    method: HttpMethod,
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, data, headers, timeout } = options;
    
    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data,
      headers: {
        ...this.config.headers as Record<string, string>,
        ...headers,
      },
      timeout: timeout ?? this.config.timeout,
    };

    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        config: response.config as HttpClientConfig,
      };
    } catch (error) {
      throw this.createApiError(error);
    }
  }

  /**
   * Effectue une requête GET
   */
  public async get<T = any>(
    url: string, 
    params?: Record<string, any>, 
    options: Omit<RequestOptions, 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, { ...options, params });
  }

  /**
   * Effectue une requête POST
   */
  public async post<T = any>(
    url: string, 
    data?: any, 
    options: Omit<RequestOptions, 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, { ...options, data });
  }

  /**
   * Effectue une requête PUT
   */
  public async put<T = any>(
    url: string, 
    data?: any, 
    options: Omit<RequestOptions, 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, { ...options, data });
  }

  /**
   * Effectue une requête DELETE
   */
  public async delete<T = any>(
    url: string, 
    options: Omit<RequestOptions, 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, options);
  }

  /**
   * Met à jour la configuration du client
   */
  public updateConfig(config: Partial<HttpClientConfig>): void {
    Object.assign(this.config, config);
    
    // Mise à jour de l'instance axios
    this.client = axios.create({
      ...this.config,
      baseURL: this.config.baseURL,
    });
    
    // Reconfiguration des intercepteurs et des réessais
    this.setupRetry();
    this.setupInterceptors();
  }
}