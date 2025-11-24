"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const tokenManager_1 = require("./tokenManager");
const httpClient_1 = require("../httpClient");
class AuthClient extends httpClient_1.HttpClient {
    constructor(options) {
        // Initialize with base URL and config
        super({
            ...options,
            onRequest: async (config) => {
                // Call parent onRequest if it exists
                const updatedConfig = options.onRequest
                    ? await options.onRequest(config)
                    : config;
                // Add authorization header if token exists
                const token = this.tokenManager.getAccessToken();
                if (token) {
                    updatedConfig.headers = {
                        ...updatedConfig.headers,
                        Authorization: `Bearer ${token}`,
                    };
                }
                return updatedConfig;
            },
            onError: async (error) => {
                // Handle 401 Unauthorized errors
                if (error.status === 401 && this.tokenManager.getRefreshToken()) {
                    try {
                        await this.refreshToken();
                        // Retry the original request with new token
                        if (error.config) {
                            return this.request(error.config.method, error.config.url || '', {
                                ...error.config,
                                headers: {
                                    ...error.config.headers,
                                    Authorization: `Bearer ${this.tokenManager.getAccessToken()}`,
                                },
                            });
                        }
                    }
                    catch (refreshError) {
                        // If refresh fails, clear tokens and notify
                        this.clearTokens();
                        if (this.onAuthStateChange) {
                            this.onAuthStateChange(false);
                        }
                    }
                }
                // Call parent onError if it exists
                if (options.onError) {
                    return options.onError(error);
                }
                throw error;
            },
        });
        this.isRefreshing = false;
        this.refreshPromise = null;
        // Initialize token manager
        this.tokenManager = new tokenManager_1.TokenManager(options.tokenManager || {});
        // Set endpoints
        this.loginEndpoint = options.loginEndpoint || '/auth/login';
        this.refreshEndpoint = options.refreshEndpoint || '/auth/refresh';
        this.logoutEndpoint = options.logoutEndpoint || '/auth/logout';
        // Set callbacks
        this.getTokensFromResponse = options.getTokensFromResponse || ((response) => ({
            accessToken: response.access_token || response.accessToken,
            refreshToken: response.refresh_token || response.refreshToken,
            expiresIn: response.expires_in || response.expiresIn,
        }));
        this.onTokensUpdated = options.onTokensUpdated;
        this.onAuthStateChange = options.onAuthStateChange;
    }
    /**
     * Login with credentials
     */
    async login(credentials) {
        try {
            const response = await this.post(this.loginEndpoint, credentials);
            await this.setTokens(response.data);
            return true;
        }
        catch (error) {
            this.clearTokens();
            throw error;
        }
    }
    /**
     * Logout
     */
    async logout() {
        try {
            await this.post(this.logoutEndpoint, {
                refreshToken: this.tokenManager.getRefreshToken(),
            });
        }
        finally {
            this.clearTokens();
            if (this.onAuthStateChange) {
                this.onAuthStateChange(false);
            }
        }
    }
    /**
     * Refresh access token using refresh token
     */
    async refreshToken() {
        // If already refreshing, return the existing promise
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }
        this.isRefreshing = true;
        try {
            const refreshToken = this.tokenManager.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            this.refreshPromise = this.post(this.refreshEndpoint, { refreshToken })
                .then((response) => {
                return this.setTokens(response.data).then(() => true);
            })
                .finally(() => {
                this.isRefreshing = false;
                this.refreshPromise = null;
            });
            return await this.refreshPromise;
        }
        catch (error) {
            this.isRefreshing = false;
            this.refreshPromise = null;
            this.clearTokens();
            throw error;
        }
    }
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.tokenManager.isAuthenticated();
    }
    /**
     * Get current authentication status
     */
    getAuthStatus() {
        return this.tokenManager.getAuthStatus();
    }
    /**
     * Set tokens from login/refresh response
     */
    async setTokens(data) {
        const { accessToken, refreshToken } = this.getTokensFromResponse(data);
        const previousAuthState = this.tokenManager.isAuthenticated();
        // Update tokens
        this.tokenManager.setAccessToken(accessToken);
        if (refreshToken) {
            this.tokenManager.setRefreshToken(refreshToken);
        }
        // Notify listeners
        if (this.onTokensUpdated) {
            this.onTokensUpdated({
                accessToken,
                refreshToken: refreshToken || null,
            });
        }
        // Notify auth state change if needed
        const newAuthState = this.tokenManager.isAuthenticated();
        if (newAuthState !== previousAuthState && this.onAuthStateChange) {
            this.onAuthStateChange(newAuthState);
        }
    }
    /**
     * Clear all tokens
     */
    clearTokens() {
        const wasAuthenticated = this.tokenManager.isAuthenticated();
        this.tokenManager.clearTokens();
        // Notify listeners
        if (this.onTokensUpdated) {
            this.onTokensUpdated({
                accessToken: undefined,
                refreshToken: undefined,
            });
        }
        // Notify auth state change if needed
        if (wasAuthenticated && this.onAuthStateChange) {
            this.onAuthStateChange(false);
        }
    }
}
exports.AuthClient = AuthClient;
