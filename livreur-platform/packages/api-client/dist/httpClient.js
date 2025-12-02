"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Classe de base pour le client HTTP
 */
class HttpClient {
    constructor(options) {
        // Configuration par défaut
        this.config = {
            timeout: 30000, // 30 secondes par défaut
            maxRetries: 3,
            retryDelay: 1000,
            shouldRetry: this.defaultShouldRetry,
            ...options.config,
            baseURL: options.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.config?.headers,
            },
        };
        this.onRequest = options.onRequest;
        this.onError = options.onError;
        // Création de l'instance Axios
        this.client = axios_1.default.create(this.config);
        // Configuration des réessais automatiques
        this.setupRetry();
        // Configuration des intercepteurs
        this.setupInterceptors();
    }
    /**
     * Détermine si une erreur doit déclencher une nouvelle tentative
     */
    defaultShouldRetry(error) {
        const axiosError = error;
        // Ne pas réessayer les requêtes qui ont échoué avec ces codes
        const doNotRetryStatuses = [400, 401, 403, 404, 422];
        return (
        // Réessayer en cas d'erreur réseau ou de timeout
        axiosError.code === 'ECONNABORTED' ||
            // Réessayer pour les erreurs 5xx
            (axiosError.response &&
                axiosError.response.status >= 500 &&
                !doNotRetryStatuses.includes(axiosError.response.status)));
    }
    /**
     * Configure les réessais automatiques avec backoff exponentiel
     */
    setupRetry() {
        const axiosRetry = require('axios-retry');
        axiosRetry(this.client, {
            retries: this.config.maxRetries ?? 3,
            retryDelay: (retryCount) => {
                // Backoff exponentiel avec un peu d'aléatoire
                const delay = Math.min((this.config.retryDelay ?? 1000) * Math.pow(2, retryCount - 1), 30000 // Maximum 30 secondes
                );
                // Ajout d'un peu d'aléatoire pour éviter le thundering herd
                return delay * (0.7 + Math.random() * 0.3);
            },
            retryCondition: (error) => {
                const shouldRetry = this.config.shouldRetry?.(error) ?? this.defaultShouldRetry(error);
                return shouldRetry;
            },
        });
    }
    /**
     * Configure les intercepteurs de requête et de réponse
     */
    setupInterceptors() {
        // Intercepteur de requête
        this.client.interceptors.request.use(async (config) => {
            let updatedConfig = config;
            // Appel du hook onRequest si défini
            if (this.onRequest) {
                updatedConfig = await this.onRequest(updatedConfig);
            }
            return updatedConfig;
        }, (error) => {
            return Promise.reject(this.createApiError(error));
        });
        // Intercepteur de réponse
        this.client.interceptors.response.use((response) => response, (error) => {
            const apiError = this.createApiError(error);
            // Appel du gestionnaire d'erreurs si défini
            if (this.onError) {
                this.onError(apiError);
            }
            return Promise.reject(apiError);
        });
    }
    /**
     * Crée une erreur API standardisée
     */
    createApiError(error) {
        if (this.isApiError(error)) {
            return error;
        }
        const axiosError = error;
        const response = axiosError.response;
        const apiError = {
            name: 'ApiError',
            message: axiosError.message || 'Une erreur inconnue est survenue',
            config: axiosError.config,
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
    isApiError(error) {
        return error.isApiError === true;
    }
    /**
     * Effectue une requête HTTP
     */
    async request(method, url, options = {}) {
        const { params, data, headers, timeout } = options;
        const config = {
            method,
            url,
            params,
            data,
            headers: {
                ...this.config.headers,
                ...headers,
            },
            timeout: timeout ?? this.config.timeout,
        };
        try {
            return await this.client.request(config);
        }
        catch (error) {
            throw this.createApiError(error);
        }
    }
    /**
     * Effectue une requête GET
     */
    async get(url, params, options = {}) {
        return this.request('GET', url, { ...options, params });
    }
    /**
     * Effectue une requête POST
     */
    async post(url, data, options = {}) {
        return this.request('POST', url, { ...options, data });
    }
    /**
     * Effectue une requête PUT
     */
    async put(url, data, options = {}) {
        return this.request('PUT', url, { ...options, data });
    }
    /**
     * Effectue une requête DELETE
     */
    async delete(url, options = {}) {
        return this.request('DELETE', url, options);
    }
    /**
     * Met à jour la configuration du client
     */
    updateConfig(config) {
        Object.assign(this.config, config);
        // Mise à jour de l'instance axios
        this.client = axios_1.default.create({
            ...this.config,
            baseURL: this.config.baseURL,
        });
        // Reconfiguration des intercepteurs et des réessais
        this.setupRetry();
        this.setupInterceptors();
    }
}
exports.HttpClient = HttpClient;
