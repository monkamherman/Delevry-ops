import { AxiosRequestConfig } from 'axios';
import { ApiError } from '../errors';
export interface HttpClientConfig extends AxiosRequestConfig {
    baseURL: string;
    token?: string;
    onUnauthorized?: () => void;
    onError?: (error: ApiError) => void;
}
export declare class HttpClient {
    private client;
    private config;
    private isRefreshing;
    private refreshSubscribers;
    constructor(config: HttpClientConfig);
    private setupInterceptors;
    /**
     * Effectue une requête GET
     */
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Effectue une requête POST
     */
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Effectue une requête PUT
     */
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Effectue une requête PATCH
     */
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Effectue une requête DELETE
     */
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Télécharge un fichier
     */
    download(url: string, config?: AxiosRequestConfig): Promise<Blob>;
    /**
     * Téléverse un fichier
     */
    upload<T = any>(url: string, file: File, fieldName?: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Met à jour le token d'authentification
     */
    setToken(token?: string): void;
    /**
     * Ajoute un abonné au rafraîchissement du token
     */
    private subscribeTokenRefresh;
    /**
     * Notifie tous les abonnés du nouveau token
     */
    private notifyRefreshSubscribers;
    /**
     * Configure le gestionnaire d'erreurs global
     */
    onError(handler: (error: ApiError) => void): void;
    /**
     * Configure le gestionnaire de déconnexion
     */
    onUnauthorized(handler: () => void): void;
}
