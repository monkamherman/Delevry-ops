import axios from 'axios';
import { HttpClient, HttpClientOptions } from '../src/httpClient';
import { ApiError } from '../src/types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const baseURL = 'https://api.livreur.fr/v1';

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance for each test
    httpClient = new HttpClient({ baseURL });
  });

  describe('constructor', () => {
    it('should create an instance with default config', () => {
      expect(httpClient).toBeInstanceOf(HttpClient);
      expect(axios.create).toHaveBeenCalledWith({
        baseURL,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
        shouldRetry: expect.any(Function),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    });

    it('should apply custom config', () => {
      const customConfig: HttpClientOptions = {
        baseURL: 'https://custom.api',
        config: {
          timeout: 10000,
          headers: {
            'X-Custom-Header': 'value'
          }
        }
      };
      
      new HttpClient(customConfig);
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom.api',
        timeout: 10000,
        maxRetries: 3,
        retryDelay: 1000,
        shouldRetry: expect.any(Function),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Custom-Header': 'value'
        },
      });
    });
  });

  describe('request', () => {
    it('should make a GET request', async () => {
      const mockResponse = {
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
      
      mockedAxios.request.mockResolvedValueOnce(mockResponse);
      
      const result = await httpClient.request('GET', '/test');
      
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });
      
      expect(result).toEqual({
        data: { id: 1, name: 'Test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });
    });

    it('should handle request errors', async () => {
      const error = new Error('Request failed');
      mockedAxios.request.mockRejectedValueOnce(error);
      
      await expect(httpClient.request('GET', '/error')).rejects.toThrow('Request failed');
    });
  });

  describe('HTTP methods', () => {
    const mockData = { id: 1, name: 'Test' };
    
    beforeEach(() => {
      mockedAxios.request.mockResolvedValue({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });
    });

    it('should make a GET request', async () => {
      await httpClient.get('/test', { param: 'value' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        params: { param: 'value' },
        headers: expect.any(Object),
        timeout: 30000,
      });
    });

    it('should make a POST request', async () => {
      await httpClient.post('/test', { name: 'New Item' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data: { name: 'New Item' },
        headers: expect.any(Object),
        timeout: 30000,
      });
    });

    it('should make a PUT request', async () => {
      await httpClient.put('/test/1', { name: 'Updated Item' });
      
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/test/1',
        data: { name: 'Updated Item' },
        headers: expect.any(Object),
        timeout: 30000,
      });
    });

    it('should make a DELETE request', async () => {
      await httpClient.delete('/test/1');
      
      expect(mockedAxios.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/test/1',
        headers: expect.any(Object),
        timeout: 30000,
      });
    });
  });

  describe('error handling', () => {
    it('should create an ApiError from an Axios error', async () => {
      const error = {
        isAxiosError: true,
        config: { url: '/test' },
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Resource not found' },
          headers: {}
        },
        message: 'Request failed with status code 404'
      };
      
      mockedAxios.request.mockRejectedValueOnce(error);
      
      try {
        await httpClient.get('/test');
        fail('Expected an error to be thrown');
      } catch (err) {
        const apiError = err as ApiError;
        expect(apiError.isApiError).toBe(true);
        expect(apiError.status).toBe(404);
        expect(apiError.message).toBe('Request failed with status code 404');
        expect(apiError.response).toBeDefined();
      }
    });
  });
});
