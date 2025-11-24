import { afterAll, beforeAll, describe, it, expect, beforeEach, jest } from '@jest/globals';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import 'whatwg-fetch'; // Nécessaire pour MSW avec Node.js
import { HttpClient } from '../../src/httpClient';

// URL de base pour les tests (relative pour MSW)
const API_BASE_URL = '/api';
const FULL_BASE_URL = 'http://localhost:3000/api';

// Données de test
let mockData = {
  users: [
    { id: 1, name: 'John Doe', role: 'livreur' },
    { id: 2, name: 'Jane Smith', role: 'client' }
  ]
};

// Configuration du serveur mock
const server = setupServer(
  // GET /api/users
  http.get(`${API_BASE_URL}/users`, () => {
    return new Response(JSON.stringify(mockData.users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }),
  
  // GET /api/users/:id
  http.get(`${API_BASE_URL}/users/:id`, ({ params }) => {
    const user = mockData.users.find(u => u.id === Number(params.id));
    if (user) {
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'User not found' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }),
  
  // POST /api/users
  http.post(`${API_BASE_URL}/users`, async ({ request }) => {
    try {
      const newUser = await request.json();
      mockData.users.push(newUser);
      return new Response(JSON.stringify(newUser), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400 }
      );
    }
  }),
  
  // Gestion des erreurs
  http.get(`${API_BASE_URL}/error`, () => {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  })
);

// Configuration des tests
beforeAll(() => {
  // Démarrer le serveur MSW
  server.listen({ onUnhandledRequest: 'error' });
  
  // Initialiser les données de test
  mockData = {
    users: [
      { id: 1, name: 'John Doe', role: 'livreur' },
      { id: 2, name: 'Jane Smith', role: 'client' }
    ]
  };
});

beforeEach(() => {
  // Réinitialiser les données de test avant chaque test
  mockData = {
    users: [
      { id: 1, name: 'John Doe', role: 'livreur' },
      { id: 2, name: 'Jane Smith', role: 'client' }
    ]
  };
  
  // Réinitialiser les mocks entre les tests
  server.resetHandlers();
});

afterAll(() => {
  // Nettoyer après les tests
  server.close();
});

describe('HttpClient - Integration Tests', () => {
  let httpClient: HttpClient;

  beforeAll(() => {
    // Créer une instance du client HTTP
    httpClient = new HttpClient({
      baseURL: FULL_BASE_URL,
      config: {
        timeout: 5000,
        maxRetries: 2,
        retryDelay: 1000,
      },
    });
  });

  it('should fetch users successfully', async () => {
    try {
      const response = await httpClient.get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });

  it('should fetch a single user', async () => {
    const userId = 1;
    const response = await httpClient.get(`/users/${userId}`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', userId);
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('role');
  });

  it('should handle 404 errors', async () => {
    try {
      await httpClient.get('/users/999');
      fail('Expected request to throw an error');
    } catch (error: any) {
      // Vérifier que c'est bien une ApiError
      expect(error.isApiError).toBe(true);
      // Vérifier le statut de la réponse
      expect(error.response?.status).toBe(404);
    }
  });

  it('should create a new user', async () => {
    const newUser = {
      id: 3,
      name: 'New User',
      role: 'client'
    };

    const response = await httpClient.post('/users', newUser);
    
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject(newUser);
    
    // Vérifier que l'utilisateur a bien été ajouté
    const getResponse = await httpClient.get('/users/3');
    expect(getResponse.data).toMatchObject(newUser);
  });

  it('should handle server errors with retry', async () => {
    try {
      await httpClient.get('/error');
      fail('Expected request to throw an error');
    } catch (error: any) {
      // Vérifier que c'est bien une ApiError
      expect(error.isApiError).toBe(true);
      // Vérifier le statut de la réponse
      expect(error.response?.status).toBe(500);
      // Vérifier que la requête a été réessayée (maxRetries: 2)
      expect(error.config['axios-retry']?.retryCount).toBe(2);
    }
  }, 15000); // Augmenter le timeout pour les réessais

  it('should apply request interceptors', async () => {
    // Créer un mock pour l'intercepteur
    const interceptor = jest.fn((config) => ({
      ...config,
      headers: {
        ...config.headers,
        'X-Custom-Header': 'test-value'
      }
    }));

    // Créer une nouvelle instance avec l'intercepteur
    const clientWithInterceptor = new HttpClient({
      baseURL: FULL_BASE_URL,
      onRequest: interceptor as any // Type assertion car l'interface attendue est différente
    });

    try {
      const response = await clientWithInterceptor.get('/users/1');
      
      // Vérifier que l'intercepteur a été appelé
      expect(interceptor).toHaveBeenCalled();
      
      // Vérifier que la requête a réussi
      expect(response.status).toBe(200);
    } catch (error) {
      console.error('Error in interceptor test:', error);
      throw error;
    }
  });
});
