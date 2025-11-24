import { JwtPayload, verify } from 'jsonwebtoken';

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

const defaultIsTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    // Vérifier si le token a un champ 'exp' et s'il est expiré
    return decoded.exp && decoded.exp < Math.floor(Date.now() / 1000);
  } catch (error) {
    return true; // Si le token est invalide, on le considère comme expiré
  }
};

export class TokenManager {
  private storage: TokenStorage;
  private accessTokenKey: string;
  private refreshTokenKey: string;
  private isTokenExpired: (token: string) => boolean;

  constructor(options: TokenManagerOptions = {}) {
    this.accessTokenKey = options.accessTokenKey || 'accessToken';
    this.refreshTokenKey = options.refreshTokenKey || 'refreshToken';
    this.isTokenExpired = options.isTokenExpired || defaultIsTokenExpired;
    
    // Use provided storage or fallback to localStorage if available
    this.storage = options.storage || (() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return {
            getItem: (key: string) => window.localStorage.getItem(key),
            setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
            removeItem: (key: string) => window.localStorage.removeItem(key)
          };
        }
      } catch (e) {
        console.warn('localStorage is not available, using memory storage');
      }
      
      // Fallback to in-memory storage
      const storage = new Map<string, string>();
      return {
        getItem: (key: string) => storage.get(key) || null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key)
      };
    })();
  }

  /**
   * Set the access token
   */
  setAccessToken(token: string): void {
    if (!token) {
      this.storage.removeItem(this.accessTokenKey);
    } else {
      this.storage.setItem(this.accessTokenKey, token);
    }
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return this.storage.getItem(this.accessTokenKey);
  }

  /**
   * Set the refresh token
   */
  setRefreshToken(token: string): void {
    if (!token) {
      this.storage.removeItem(this.refreshTokenKey);
    } else {
      this.storage.setItem(this.refreshTokenKey, token);
    }
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null {
    return this.storage.getItem(this.refreshTokenKey);
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.storage.removeItem(this.accessTokenKey);
    this.storage.removeItem(this.refreshTokenKey);
  }

  /**
   * Check if the current access token is valid and not expired
   */
  isAuthenticated(): boolean {
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
