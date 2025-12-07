import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { clearToken, getToken } from "./auth";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Gestion des erreurs HTTP
          const { status } = error.response;

          if (status === 401) {
            // Déconnexion si non autorisé
            clearToken();
            window.location.href = "/login";
          }

          // Vous pouvez ajouter d'autres gestions d'erreurs ici
          console.error("Erreur API:", error.response.data);
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          console.error("Pas de réponse du serveur:", error.request);
        } else {
          // Une erreur s'est produite lors de la configuration de la requête
          console.error(
            "Erreur de configuration de la requête:",
            error.message
          );
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient();
