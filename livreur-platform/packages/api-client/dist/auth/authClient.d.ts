import { TokenManagerOptions } from './tokenManager';
import { HttpClient, HttpClientOptions } from '../httpClient';
interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}
export interface AuthClientOptions extends HttpClientOptions {
    /**
     * URL endpoint for login
     * @default '/auth/login'
     */
    loginEndpoint?: string;
    /**
     * URL endpoint for token refresh
     * @default '/auth/refresh'
     */
    refreshEndpoint?: string;
    /**
     * URL endpoint for logout
     * @default '/auth/logout'
     */
    logoutEndpoint?: string;
    /**
     * Token manager configuration
     */
    tokenManager?: TokenManagerOptions;
    /**
     * Function to extract tokens from login response
     * @param response Login API response
     * @returns AuthTokens object
     */
    getTokensFromResponse?: (response: any) => AuthTokens;
    /**
     * Callback when tokens are updated
     */
    onTokensUpdated?: (tokens: {
        accessToken?: string;
        refreshToken?: string | null;
    }) => void;
    /**
     * Callback when authentication state changes
     */
    onAuthStateChange?: (isAuthenticated: boolean) => void;
}
export declare class AuthClient extends HttpClient {
    private tokenManager;
    private loginEndpoint;
    private refreshEndpoint;
    private logoutEndpoint;
    private getTokensFromResponse;
    private onTokensUpdated?;
    private onAuthStateChange?;
    private isRefreshing;
    private refreshPromise;
    constructor(options: AuthClientOptions);
    /**
     * Login with credentials
     */
    login(credentials: any): Promise<boolean>;
    /**
     * Logout
     */
    logout(): Promise<void>;
    /**
     * Refresh access token using refresh token
     */
    refreshToken(): Promise<boolean>;
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Get current authentication status
     */
    getAuthStatus(): {
        isAuthenticated: boolean;
        accessToken: string | null;
        refreshToken: string | null;
        hasRefreshToken: boolean;
    };
    /**
     * Set tokens from login/refresh response
     */
    private setTokens;
    /**
     * Clear all tokens
     */
    private clearTokens;
}
export {};
