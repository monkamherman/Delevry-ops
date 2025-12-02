"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const defaultIsTokenExpired = (token) => {
    try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        // Vérifier si le token a un champ 'exp' et s'il est expiré
        return decoded.exp && decoded.exp < Math.floor(Date.now() / 1000);
    }
    catch (error) {
        return true; // Si le token est invalide, on le considère comme expiré
    }
};
class TokenManager {
    constructor(options = {}) {
        this.accessTokenKey = options.accessTokenKey || 'accessToken';
        this.refreshTokenKey = options.refreshTokenKey || 'refreshToken';
        this.isTokenExpired = options.isTokenExpired || defaultIsTokenExpired;
        // Use provided storage or fallback to localStorage if available
        this.storage = options.storage || (() => {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    return {
                        getItem: (key) => window.localStorage.getItem(key),
                        setItem: (key, value) => window.localStorage.setItem(key, value),
                        removeItem: (key) => window.localStorage.removeItem(key)
                    };
                }
            }
            catch (e) {
                console.warn('localStorage is not available, using memory storage');
            }
            // Fallback to in-memory storage
            const storage = new Map();
            return {
                getItem: (key) => storage.get(key) || null,
                setItem: (key, value) => storage.set(key, value),
                removeItem: (key) => storage.delete(key)
            };
        })();
    }
    /**
     * Set the access token
     */
    setAccessToken(token) {
        if (!token) {
            this.storage.removeItem(this.accessTokenKey);
        }
        else {
            this.storage.setItem(this.accessTokenKey, token);
        }
    }
    /**
     * Get the current access token
     */
    getAccessToken() {
        return this.storage.getItem(this.accessTokenKey);
    }
    /**
     * Set the refresh token
     */
    setRefreshToken(token) {
        if (!token) {
            this.storage.removeItem(this.refreshTokenKey);
        }
        else {
            this.storage.setItem(this.refreshTokenKey, token);
        }
    }
    /**
     * Get the current refresh token
     */
    getRefreshToken() {
        return this.storage.getItem(this.refreshTokenKey);
    }
    /**
     * Clear all tokens
     */
    clearTokens() {
        this.storage.removeItem(this.accessTokenKey);
        this.storage.removeItem(this.refreshTokenKey);
    }
    /**
     * Check if the current access token is valid and not expired
     */
    isAuthenticated() {
        const token = this.getAccessToken();
        return !!token && !this.isTokenExpired(token);
    }
    /**
     * Get the current authentication status and tokens
     */
    getAuthStatus() {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        const isAuthenticated = this.isAuthenticated();
        return {
            isAuthenticated,
            accessToken,
            refreshToken,
            hasRefreshToken: !!refreshToken
        };
    }
}
exports.TokenManager = TokenManager;
