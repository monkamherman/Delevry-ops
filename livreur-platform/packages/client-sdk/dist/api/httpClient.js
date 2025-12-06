"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../errors");
class HttpClient {
    constructor(config) {
        this.isRefreshing = false;
        this.refreshSubscribers = [];
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...(config.token && { Authorization: `Bearer ${config.token}` }),
                ...config.headers,
            },
            ...config,
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Intercepteur de requête pour ajouter le token d'authentification
        this.client.interceptors.request.use((config) => {
            // Vous pouvez ajouter ici des en-têtes personnalisés ou des tokens
            return config;
        }, (error) => Promise.reject(error));
        // Intercepteur de réponse pour gérer les erreurs globales
        this.client.interceptors.response.use((response) => response, async (error) => {
            var _a, _b, _c, _d;
            const apiError = errors_1.ApiError.fromResponse(error);
            // Gestion des erreurs d'authentification
            if (apiError.isAuthError) {
                (_b = (_a = this.config).onUnauthorized) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            // Appeler le gestionnaire d'erreurs global
            (_d = (_c = this.config).onError) === null || _d === void 0 ? void 0 : _d.call(_c, apiError);
            return Promise.reject(apiError);
        });
    }
    /**
     * Effectue une requête GET
     */
    async get(url, config) {
        const response = await this.client.get(url, config);
        return response.data;
    }
    /**
     * Effectue une requête POST
     */
    async post(url, data, config) {
        const response = await this.client.post(url, data, config);
        return response.data;
    }
    /**
     * Effectue une requête PUT
     */
    async put(url, data, config) {
        const response = await this.client.put(url, data, config);
        return response.data;
    }
    /**
     * Effectue une requête PATCH
     */
    async patch(url, data, config) {
        const response = await this.client.patch(url, data, config);
        return response.data;
    }
    /**
     * Effectue une requête DELETE
     */
    async delete(url, config) {
        const response = await this.client.delete(url, config);
        return response.data;
    }
    /**
     * Télécharge un fichier
     */
    async download(url, config) {
        const response = await this.client.get(url, {
            ...config,
            responseType: 'blob',
        });
        return response.data;
    }
    /**
     * Téléverse un fichier
     */
    async upload(url, file, fieldName = 'file', data, config) {
        const formData = new FormData();
        formData.append(fieldName, file);
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
        const response = await this.client.post(url, formData, {
            ...config,
            headers: {
                ...config === null || config === void 0 ? void 0 : config.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    /**
     * Met à jour le token d'authentification
     */
    setToken(token) {
        this.config.token = token;
        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            this.notifyRefreshSubscribers(token);
        }
        else {
            delete this.client.defaults.headers.common['Authorization'];
        }
    }
    /**
     * Ajoute un abonné au rafraîchissement du token
     */
    subscribeTokenRefresh(callback) {
        this.refreshSubscribers.push(callback);
    }
    /**
     * Notifie tous les abonnés du nouveau token
     */
    notifyRefreshSubscribers(token) {
        this.refreshSubscribers.forEach(callback => callback(token));
        this.refreshSubscribers = [];
    }
    /**
     * Configure le gestionnaire d'erreurs global
     */
    onError(handler) {
        this.config.onError = handler;
    }
    /**
     * Configure le gestionnaire de déconnexion
     */
    onUnauthorized(handler) {
        this.config.onUnauthorized = handler;
    }
}
exports.HttpClient = HttpClient;
