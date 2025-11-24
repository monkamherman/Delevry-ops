import axios from 'axios';
import { AuthClient } from '../src/auth/authClient';
import { TokenManager } from '../src/auth/tokenManager';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock TokenManager
jest.mock('../src/auth/tokenManager');
const MockTokenManager = TokenManager as jest.MockedClass<typeof TokenManager>;

describe('AuthClient', () => {
  let authClient: AuthClient;
  let mockTokenManager: jest.Mocked<TokenManager>;
  
  const baseURL = 'https://api.livreur.fr/v1';
  const loginEndpoint = '/auth/login';
  const refreshEndpoint = '/auth/refresh';
  const logoutEndpoint = '/auth/logout';
  
  const mockTokens = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  };
  
  const mockAuthResponse = {
    data: {
      access_token: mockTokens.accessToken,
      refresh_token: mockTokens.refreshToken,
      expires_in: 3600,
    },
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup TokenManager mock
    mockTokenManager = {
      getAccessToken: jest.fn(),
      setAccessToken: jest.fn(),
      getRefreshToken: jest.fn(),
      setRefreshToken: jest.fn(),
      clearTokens: jest.fn(),
      isAuthenticated: jest.fn(),
      getAuthStatus: jest.fn(),
    } as unknown as jest.Mocked<TokenManager>;
    
    MockTokenManager.mockImplementation(() => mockTokenManager);
    
    // Create AuthClient instance
    authClient = new AuthClient({
      baseURL,
      loginEndpoint,
      refreshEndpoint,
      logoutEndpoint,
    });
    
    // Mock axios request implementation
    mockedAxios.request.mockResolvedValue({ data: {} });
  });

  describe('login', () => {
    it('should call login endpoint and set tokens', async () => {
      // Mock successful login response
      mockedAxios.request.mockResolvedValueOnce(mockAuthResponse);
      
      const credentials = {
        email: 'user@example.com',
        password: 'password123',
      };
      
      const result = await authClient.login(credentials);
      
      // Should call login endpoint with credentials
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: loginEndpoint,
        data: credentials,
        baseURL,
        headers: expect.any(Object),
      });
      
      // Should set tokens in TokenManager
      expect(mockTokenManager.setAccessToken).toHaveBeenCalledWith(mockTokens.accessToken);
      expect(mockTokenManager.setRefreshToken).toHaveBeenCalledWith(mockTokens.refreshToken);
      
      // Should return true on success
      expect(result).toBe(true);
    });
    
    it('should clear tokens and rethrow on login failure', async () => {
      // Mock failed login
      const error = new Error('Login failed');
      mockedAxios.request.mockRejectedValueOnce(error);
      
      await expect(authClient.login({ email: '', password: '' })).rejects.toThrow('Login failed');
      
      // Should clear tokens on failure
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and clear tokens', async () => {
      // Mock TokenManager to return a refresh token
      mockTokenManager.getRefreshToken.mockReturnValueOnce(mockTokens.refreshToken);
      
      await authClient.logout();
      
      // Should call logout endpoint with refresh token
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: logoutEndpoint,
        data: { refreshToken: mockTokens.refreshToken },
        baseURL,
        headers: expect.any(Object),
      });
      
      // Should clear tokens
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });
    
    it('should clear tokens even if logout request fails', async () => {
      // Mock failed logout
      mockedAxios.request.mockRejectedValueOnce(new Error('Network error'));
      
      await authClient.logout();
      
      // Should still clear tokens
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Mock TokenManager to return a refresh token
      mockTokenManager.getRefreshToken.mockReturnValueOnce(mockTokens.refreshToken);
      
      // Mock successful refresh response
      mockedAxios.request.mockResolvedValueOnce(mockAuthResponse);
      
      const result = await (authClient as any).refreshToken();
      
      // Should call refresh endpoint with refresh token
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: refreshEndpoint,
        data: { refreshToken: mockTokens.refreshToken },
        baseURL,
        headers: expect.any(Object),
      });
      
      // Should update tokens
      expect(mockTokenManager.setAccessToken).toHaveBeenCalledWith(mockTokens.accessToken);
      expect(mockTokenManager.setRefreshToken).toHaveBeenCalledWith(mockTokens.refreshToken);
      
      // Should return true on success
      expect(result).toBe(true);
    });
    
    it('should handle refresh token failure', async () => {
      // Mock TokenManager to return a refresh token
      mockTokenManager.getRefreshToken.mockReturnValueOnce(mockTokens.refreshToken);
      
      // Mock failed refresh
      const error = new Error('Refresh failed');
      mockedAxios.request.mockRejectedValueOnce(error);
      
      await expect((authClient as any).refreshToken()).rejects.toThrow('Refresh failed');
      
      // Should clear tokens on failure
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
    });
    
    it('should handle missing refresh token', async () => {
      // Mock TokenManager to return no refresh token
      mockTokenManager.getRefreshToken.mockReturnValueOnce(null);
      
      await expect((authClient as any).refreshToken()).rejects.toThrow('No refresh token available');
    });
  });

  describe('isAuthenticated', () => {
    it('should delegate to TokenManager', () => {
      mockTokenManager.isAuthenticated.mockReturnValueOnce(true);
      expect(authClient.isAuthenticated()).toBe(true);
      expect(mockTokenManager.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe('getAuthStatus', () => {
    it('should delegate to TokenManager', () => {
      const mockStatus = {
        isAuthenticated: true,
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        hasRefreshToken: true,
      };
      
      mockTokenManager.getAuthStatus.mockReturnValueOnce(mockStatus);
      
      const result = authClient.getAuthStatus();
      
      expect(result).toEqual(mockStatus);
      expect(mockTokenManager.getAuthStatus).toHaveBeenCalled();
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header with access token', async () => {
      // Mock TokenManager to return an access token
      mockTokenManager.getAccessToken.mockReturnValueOnce(mockTokens.accessToken);
      
      // Create a new instance to test the interceptor
      const client = new AuthClient({
        baseURL,
        loginEndpoint,
        refreshEndpoint,
        logoutEndpoint,
      });
      
      // Mock axios instance
      const mockRequest = jest.fn().mockResolvedValue({ data: {} });
      (client as any).client = { request: mockRequest };
      
      // Make a request
      await client.get('/protected');
      
      // Should add Authorization header with access token
      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/protected',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${mockTokens.accessToken}`,
        },
        timeout: 30000,
      });
    });
  });

  describe('response interceptor', () => {
    it('should refresh token on 401 and retry request', async () => {
      // Mock TokenManager to return an access token and refresh token
      mockTokenManager.getAccessToken.mockReturnValue('expired-token');
      mockTokenManager.getRefreshToken.mockReturnValue(mockTokens.refreshToken);
      
      // Mock first request to fail with 401
      const errorResponse = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          config: {
            method: 'GET',
            url: '/protected',
            headers: {
              'Authorization': 'Bearer expired-token',
            },
          },
        },
      };
      
      // First request fails with 401
      // Second request (refresh token) succeeds
      // Third request (retry) succeeds
      mockedAxios.request
        .mockRejectedValueOnce(errorResponse)
        .mockResolvedValueOnce({ data: mockAuthResponse.data })
        .mockResolvedValueOnce({ data: { success: true } });
      
      // Make the request
      const response = await authClient.get('/protected');
      
      // Should have refreshed the token
      expect(mockTokenManager.setAccessToken).toHaveBeenCalledWith(mockTokens.accessToken);
      expect(mockTokenManager.setRefreshToken).toHaveBeenCalledWith(mockTokens.refreshToken);
      
      // Should have retried the original request with new token
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(response).toEqual({ data: { success: true } });
    });
    
    it('should clear tokens and notify on auth state change if refresh fails', async () => {
      // Mock TokenManager to return an access token and refresh token
      mockTokenManager.getAccessToken.mockReturnValue('expired-token');
      mockTokenManager.getRefreshToken.mockReturnValue(mockTokens.refreshToken);
      
      // Mock first request to fail with 401
      const errorResponse = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          config: {
            method: 'GET',
            url: '/protected',
          },
        },
      };
      
      // Mock refresh to fail
      mockedAxios.request
        .mockRejectedValueOnce(errorResponse)
        .mockRejectedValueOnce(new Error('Refresh failed'));
      
      // Mock onAuthStateChange callback
      const onAuthStateChange = jest.fn();
      authClient = new AuthClient({
        baseURL,
        onAuthStateChange,
      });
      
      // Make the request
      await expect(authClient.get('/protected')).rejects.toThrow('Request failed with status code 401');
      
      // Should have cleared tokens
      expect(mockTokenManager.clearTokens).toHaveBeenCalled();
      
      // Should have called onAuthStateChange with false
      expect(onAuthStateChange).toHaveBeenCalledWith(false);
    });
  });
});
