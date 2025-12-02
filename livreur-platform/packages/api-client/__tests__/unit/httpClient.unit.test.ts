import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { HttpClient } from '../../src/httpClient';

const API_BASE_URL = '/api';

const server = setupServer(
  rest.get(`${API_BASE_URL}/test`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'success' }));
  }),
  rest.post(`${API_BASE_URL}/test`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(req.body));
  })
);

describe('HttpClient - Unit Tests', () => {
  let httpClient: HttpClient;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
    httpClient = new HttpClient({ baseURL: API_BASE_URL });
  });

  afterAll(() => {
    server.close();
  });

  it('should perform GET request', async () => {
    const response = await httpClient.get('/test');
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'success' });
  });

  it('should perform POST request', async () => {
    const payload = { foo: 'bar' };
    const response = await httpClient.post('/test', payload);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(payload);
  });
});
