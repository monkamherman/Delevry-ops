# @livreur/api-client

Client HTTP pour l'API de la plateforme de suivi de livreurs avec support de l'authentification et de la validation des réponses.

## Fonctionnalités

- ✅ Client HTTP complet (GET, POST, PUT, DELETE)
- 🔒 Gestion des tokens d'authentification
- 🔄 Rafraîchissement automatique des tokens
- 🛡️ Validation des réponses avec Zod
- 🔁 Réessais automatiques avec backoff exponentiel
- 🧩 Architecture modulaire et extensible
- 📝 Documentation complète des types TypeScript
- 🧪 Tests unitaires et d'intégration complets

## Installation

```bash
bun add @livreur/api-client
```

## Table des matières
- [Installation](#installation)
- [Utilisation de base](#utilisation-de-base)
  - [Client HTTP simple](#client-http-simple)
  - [Gestion des erreurs](#gestion-des-erreurs)
  - [Intercepteurs](#intercepteurs)
- [Validation des réponses](#validation-des-réponses)
- [Tests](#tests)
  - [Tests unitaires](#tests-unitaires)
  - [Tests d'intégration](#tests-dintégration)
- [Référence d'API](#référence-dapi)
- [Développement](#développement)

## Installation

```bash
bun add @livreur/api-client
```

## Utilisation de base

### Client HTTP simple

```typescript
import { HttpClient } from '@livreur/api-client';

// Création d'une instance du client HTTP
const apiClient = new HttpClient({
  baseURL: 'https://api.livreur.fr/v1',
  config: {
    timeout: 10000, // 10 secondes
    headers: {
      'X-Custom-Header': 'valeur'
    }
  }
});

// Requête GET avec paramètres
const { data } = await apiClient.get('/livreurs', {
  params: { status: 'disponible' }
});

// Requête POST avec données
const newDelivery = {
  clientId: 'client-123',
  address: '123 Rue de Paris',
  items: ['colis-1', 'colis-2']
};

const response = await apiClient.post('/livraisons', newDelivery);
```

### Client avec authentification

```typescript
import { AuthClient } from '@livreur/api-client';

const authClient = new AuthClient({
  baseURL: 'https://api.livreur.fr/v1',
  loginEndpoint: '/auth/login',
  refreshEndpoint: '/auth/refresh',
  logoutEndpoint: '/auth/logout',
  onAuthStateChange: (isAuthenticated) => {
    console.log('État d\'authentification:', isAuthenticated);
  }
});

// Connexion
await authClient.login({
  email: 'user@example.com',
  password: 'motdepasse'
});

// Les tokens sont automatiquement gérés
const { data } = await authClient.get('/profil');

// Déconnexion
await authClient.logout();
```

### Validation des réponses

```typescript
import { z } from 'zod';
import { responseValidator } from '@livreur/api-client';

// Définir un schéma de validation
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['client', 'livreur', 'admin']),
  createdAt: z.string().datetime()
});

// Valider une réponse
try {
  const response = await apiClient.get('/utilisateur/123');
  const user = responseValidator.validate(response.data, userSchema);
  console.log('Utilisateur valide:', user);
} catch (error) {
  if (error.name === 'ValidationError') {
    console.error('Erreur de validation:', error.issues);
  }
}
```

## Gestion des erreurs

Le client gère plusieurs types d'erreurs :

- **Erreurs réseau** : problèmes de connexion, timeouts, etc.
- **Erreurs HTTP** : réponses 4xx et 5xx
- **Erreurs de validation** : données invalides par rapport aux schémas définis
- **Erreurs d'authentification** : tokens invalides ou expirés

```typescript
try {
  await apiClient.get('/ressource-inexistante');
} catch (error) {
  if (error.status === 401) {
    // Non authentifié
    redirectToLogin();
  } else if (error.status === 403) {
    // Permission refusée
    showError('Vous n\'avez pas les droits nécessaires');
  } else if (error.name === 'ValidationError') {
    // Erreur de validation
    console.error('Erreurs de validation:', error.issues);
  } else {
    // Autre erreur
    console.error('Erreur inattendue:', error);
  }
}
```

Consultez la [documentation complète des erreurs](./docs/errors.md) pour plus de détails.

## Configuration avancée

### Options du client HTTP

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | URL de base de l'API (requis) |
| `config` | `HttpClientConfig` | Configuration du client HTTP |
| `onRequest` | `(config) => Promise<HttpClientConfig>` | Hook avant chaque requête |
| `onError` | `(error: ApiError) => void` | Gestionnaire d'erreurs global |

### Options du client d'authentification

En plus des options du client HTTP, `AuthClient` accepte :

| Option | Type | Description |
|--------|------|-------------|
| `loginEndpoint` | `string` | Endpoint pour la connexion (défaut: '/auth/login') |
| `refreshEndpoint` | `string` | Endpoint pour le rafraîchissement du token (défaut: '/auth/refresh') |
| `tokenManager` | `TokenManagerOptions` | Configuration du gestionnaire de tokens |
| `getTokensFromResponse` | `(response: any) => AuthTokens` | Fonction pour extraire les tokens de la réponse |
| `onTokensUpdated` | `(tokens) => void` | Callback lors de la mise à jour des tokens |
| `onAuthStateChange` | `(isAuthenticated: boolean) => void` | Callback lors du changement d'état d'authentification |

## Tests

### Tests unitaires

Les tests unitaires vérifient le bon fonctionnement isolé de chaque composant.

```typescript
// Exemple de test unitaire pour le client HTTP
describe('HttpClient', () => {
  let httpClient: HttpClient;
  
  beforeEach(() => {
    httpClient = new HttpClient({
      baseURL: 'https://api.livreur.fr/v1'
    });
  });
  
  it('should make GET requests', async () => {
    const response = await httpClient.get('/users');
    expect(response.status).toBe(200);
  });
});
```

### Tests d'intégration

Les tests d'intégration vérifient le bon fonctionnement du client avec un serveur mocké.

```typescript
// Exemple de test d'intégration
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('https://api.livreur.fr/v1/users', (req, res, ctx) => {
    return res(
      ctx.json([{ id: 1, name: 'John Doe' }])
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('HttpClient - Integration', () => {
  it('should fetch users from the API', async () => {
    const client = new HttpClient({
      baseURL: 'https://api.livreur.fr/v1'
    });
    
    const response = await client.get('/users');
    expect(response.data).toEqual([{ id: 1, name: 'John Doe' }]);
  });
});
```

## Référence d'API

### HttpClient

#### Constructeur

```typescript
new HttpClient(options: HttpClientOptions)
```

**Options :**

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | URL de base pour toutes les requêtes |
| `config` | `HttpClientConfig` | Configuration du client (timeout, retries, etc.) |

#### Méthodes

- `get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>`
- `post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>`
- `put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>`
- `delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>`
- `setAuthToken(token: string): void` - Définit le token d'authentification
- `clearAuthToken(): void` - Supprime le token d'authentification

## Développement

### Installation des dépendances

```bash
bun install
```

### Compilation

```bash
bun build
```

### Tests

```bash
# Exécuter tous les tests
bun test

# Exécuter uniquement les tests unitaires
bun test:unit

# Exécuter uniquement les tests d'intégration
bun test:integration

# Exécuter les tests en mode watch
bun test:watch

# Générer un rapport de couverture
bun test:coverage

# Vérifier le formatage du code
bun format:check

# Formater le code
bun format:write
```

## Licence

MIT