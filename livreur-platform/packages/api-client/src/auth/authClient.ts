import { TokenManager, TokenManagerOptions } from './tokenManager';
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
  onTokensUpdated?: (tokens: { accessToken?: string; refreshToken?: string | null }) => void;
  
  /**
   * Callback when authentication state changes
   */
  onAuthStateChange?: (isAuthenticated: boolean) => void;
}

export class AuthClient extends HttpClient {
  private tokenManager: TokenManager;
  private loginEndpoint: string;
  private refreshEndpoint: string;
  private logoutEndpoint: string;
  private getTokensFromResponse: (response: any) => AuthTokens;
  private onTokensUpdated?: (tokens: { accessToken?: string; refreshToken?: string | null }) => void;
  private onAuthStateChange?: (isAuthenticated: boolean) => void;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(options: AuthClientOptions) {
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
              return this.request(
                error.config.method as any,
                error.config.url || '',
                {
                  ...error.config,
                  headers: {
                    ...error.config.headers,
                    Authorization: `Bearer ${this.tokenManager.getAccessToken()}`,
                  },
                }
              );
            }
          } catch (refreshError) {
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

    // Initialize token manager
    this.tokenManager = new TokenManager(options.tokenManager || {});
    
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
  async login(credentials: any): Promise<boolean> {
    try {
      const response = await this.post(this.loginEndpoint, credentials);
      await this.setTokens(response.data);
      return true;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.post(this.logoutEndpoint, {
        refreshToken: this.tokenManager.getRefreshToken(),
      });
    } finally {
      this.clearTokens();
      if (this.onAuthStateChange) {
        this.onAuthStateChange(false);
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
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
    } catch (error) {
      this.isRefreshing = false;
      this.refreshPromise = null;
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
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
  private async setTokens(data: any): Promise<void> {
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
  private clearTokens(): void {
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
