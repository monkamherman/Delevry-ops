import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiError } from "../errors";

export interface HttpClientConfig extends AxiosRequestConfig {
  baseURL: string;
  token?: string;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
}

export class HttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(config: HttpClientConfig) {
    this.config = config;
    const { baseURL, headers, timeout, token, ...restConfig } = config;
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      timeout,
      ...restConfig,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercepteur de requête pour ajouter le token d'authentification
    this.client.interceptors.request.use(
      (config) => {
        // Vous pouvez ajouter ici des en-têtes personnalisés ou des tokens
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse pour gérer les erreurs globales
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const apiError = ApiError.fromResponse(error);

        // Gestion des erreurs d'authentification
        if (apiError.isAuthError) {
          this.config.onUnauthorized?.();
        }

        // Appeler le gestionnaire d'erreurs global
        this.config.onError?.(apiError);

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Effectue une requête GET
   */
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Effectue une requête POST
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Effectue une requête PUT
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Effectue une requête PATCH
   */
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Effectue une requête DELETE
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Télécharge un fichier
   */
  public async download(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  /**
   * Téléverse un fichier
   */
  public async upload<T = any>(
    url: string,
    file: File,
    fieldName = "file",
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
    }

    const response = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  /**
   * Met à jour le token d'authentification
   */
  public setToken(token?: string): void {
    this.config.token = token;

    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      this.notifyRefreshSubscribers(token);
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  /**
   * Ajoute un abonné au rafraîchissement du token
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notifie tous les abonnés du nouveau token
   */
  private notifyRefreshSubscribers(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Configure le gestionnaire d'erreurs global
   */
  public onError(handler: (error: ApiError) => void): void {
    this.config.onError = handler;
  }

  /**
   * Configure le gestionnaire de déconnexion
   */
  public onUnauthorized(handler: () => void): void {
    this.config.onUnauthorized = handler;
  }
}
