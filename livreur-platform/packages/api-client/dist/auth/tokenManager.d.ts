type TokenStorage = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
};
export interface TokenManagerOptions {
    /**
     * Storage mechanism for persisting tokens (default: localStorage if available)
     */
    storage?: TokenStorage;
    /**
     * Storage key for the access token (default: 'accessToken')
     */
    accessTokenKey?: string;
    /**
     * Storage key for the refresh token (default: 'refreshToken')
     */
    refreshTokenKey?: string;
    /**
     * Function to check if a token is expired
     * @returns boolean indicating if token is expired
     */
    isTokenExpired?: (token: string) => boolean;
}
export declare class TokenManager {
    private storage;
    private accessTokenKey;
    private refreshTokenKey;
    private isTokenExpired;
    constructor(options?: TokenManagerOptions);
    /**
     * Set the access token
     */
    setAccessToken(token: string): void;
    /**
     * Get the current access token
     */
    getAccessToken(): string | null;
    /**
     * Set the refresh token
     */
    setRefreshToken(token: string): void;
    /**
     * Get the current refresh token
     */
    getRefreshToken(): string | null;
    /**
     * Clear all tokens
     */
    clearTokens(): void;
    /**
     * Check if the current access token is valid and not expired
     */
    isAuthenticated(): boolean;
    /**
     * Get the current authentication status and tokens
     */
    getAuthStatus(): {
        isAuthenticated: boolean;
        accessToken: string | null;
        refreshToken: string | null;
        hasRefreshToken: boolean;
    };
}
export {};
