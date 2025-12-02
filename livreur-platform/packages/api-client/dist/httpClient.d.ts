import { HttpClientConfig, HttpClientOptions, ApiResponse, HttpMethod, RequestOptions } from './types';
/**
 * Classe de base pour le client HTTP
 */
export declare class HttpClient {
    private client;
    private readonly config;
    private readonly onRequest?;
    private readonly onError?;
    constructor(options: HttpClientOptions);
    /**
     * Détermine si une erreur doit déclencher une nouvelle tentative
     */
    private defaultShouldRetry;
    /**
     * Configure les réessais automatiques avec backoff exponentiel
     */
    private setupRetry;
    /**
     * Configure les intercepteurs de requête et de réponse
     */
    private setupInterceptors;
    /**
     * Crée une erreur API standardisée
     */
    private createApiError;
    /**
     * Vérifie si une erreur est une ApiError
     */
    private isApiError;
    /**
     * Effectue une requête HTTP
     */
    request<T = any>(method: HttpMethod, url: string, options?: RequestOptions): Promise<ApiResponse<T>>;
    /**
     * Effectue une requête GET
     */
    get<T = any>(url: string, params?: Record<string, any>, options?: Omit<RequestOptions, 'data'>): Promise<ApiResponse<T>>;
    /**
     * Effectue une requête POST
     */
    post<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'data'>): Promise<ApiResponse<T>>;
    /**
     * Effectue une requête PUT
     */
    put<T = any>(url: string, data?: any, options?: Omit<RequestOptions, 'data'>): Promise<ApiResponse<T>>;
    /**
     * Effectue une requête DELETE
     */
    delete<T = any>(url: string, options?: Omit<RequestOptions, 'data'>): Promise<ApiResponse<T>>;
    /**
     * Met à jour la configuration du client
     */
    updateConfig(config: Partial<HttpClientConfig>): void;
}
