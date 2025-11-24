import { TokenManager } from '../src/auth/tokenManager';

describe('TokenManager', () => {
  let tokenManager: TokenManager;
  const mockStorage: Record<string, string> = {};
  
  const mockStorageImplementation = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  };

  const createToken = (exp: number) => {
    // Crée un JWT expirant dans 'exp' secondes
    const header = Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'HS256' })).toString('base64').replace(/=+$/, '');
    const payload = Buffer.from(JSON.stringify({ 
      exp: Math.floor(Date.now() / 1000) + exp,
      iat: Math.floor(Date.now() / 1000) - 1000, // Issued at
      sub: 'user123'
    })).toString('base64').replace(/=+$/, '');
    return `${header}.${payload}.signature`;
  };

  beforeEach(() => {
    // Réinitialiser le stockage avant chaque test
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    
    tokenManager = new TokenManager({
      storage: mockStorageImplementation,
      accessTokenKey: 'test_access_token',
      refreshTokenKey: 'test_refresh_token',
    });
  });

  describe('setAccessToken', () => {
    it('should set the access token in storage', () => {
      const token = 'test-access-token';
      tokenManager.setAccessToken(token);
      expect(mockStorage['test_access_token']).toBe(token);
    });

    it('should remove the access token when set to null', () => {
      mockStorage['test_access_token'] = 'existing-token';
      tokenManager.setAccessToken(null as any);
      expect(mockStorage['test_access_token']).toBeUndefined();
    });
  });

  describe('getAccessToken', () => {
    it('should return the access token from storage', () => {
      const token = 'test-access-token';
      mockStorage['test_access_token'] = token;
      expect(tokenManager.getAccessToken()).toBe(token);
    });

    it('should return null when no access token is set', () => {
      expect(tokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('setRefreshToken', () => {
    it('should set the refresh token in storage', () => {
      const token = 'test-refresh-token';
      tokenManager.setRefreshToken(token);
      expect(mockStorage['test_refresh_token']).toBe(token);
    });

    it('should remove the refresh token when set to null', () => {
      mockStorage['test_refresh_token'] = 'existing-token';
      tokenManager.setRefreshToken(null as any);
      expect(mockStorage['test_refresh_token']).toBeUndefined();
    });
  });

  describe('getRefreshToken', () => {
    it('should return the refresh token from storage', () => {
      const token = 'test-refresh-token';
      mockStorage['test_refresh_token'] = token;
      expect(tokenManager.getRefreshToken()).toBe(token);
    });

    it('should return null when no refresh token is set', () => {
      expect(tokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should remove both access and refresh tokens', () => {
      mockStorage['test_access_token'] = 'access-token';
      mockStorage['test_refresh_token'] = 'refresh-token';
      
      tokenManager.clearTokens();
      
      expect(mockStorage['test_access_token']).toBeUndefined();
      expect(mockStorage['test_refresh_token']).toBeUndefined();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token is valid', () => {
      const validToken = createToken(3600); // Token valide pour 1 heure
      tokenManager.setAccessToken(validToken);
      expect(tokenManager.isAuthenticated()).toBe(true);
    });

    it('should return false when access token is expired', () => {
      const expiredToken = createToken(-3600); // Token expiré il y a 1 heure
      tokenManager.setAccessToken(expiredToken);
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('should return false when access token is invalid', () => {
      tokenManager.setAccessToken('invalid-token');
      expect(tokenManager.isAuthenticated()).toBe(false);
    });

    it('should return false when no access token is set', () => {
      expect(tokenManager.isAuthenticated()).toBe(false);
    });
  });

  describe('getAuthStatus', () => {
    it('should return the correct authentication status', () => {
      const accessToken = createToken(3600);
      const refreshToken = 'test-refresh-token';
      
      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      
      const status = tokenManager.getAuthStatus();
      
      expect(status).toEqual({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        hasRefreshToken: true,
      });
    });

    it('should handle missing tokens', () => {
      const status = tokenManager.getAuthStatus();
      
      expect(status).toEqual({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        hasRefreshToken: false,
      });
    });
  });
});
