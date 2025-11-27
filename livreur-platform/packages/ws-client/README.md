# @livreur/ws-client

Client WebSocket pour la plateforme de suivi de livreurs en temps réel.

## Installation

```bash
bun add @livreur/ws-client
```

## Utilisation de base

```typescript
import { createWebSocketClient, WebSocketStatus } from '@livreur/ws-client';

// Créer une instance du client
const wsClient = createWebSocketClient('ws://localhost:3000/ws', {
  debug: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});

// Écouter les événements de connexion
wsClient.on('connected', () => {
  console.log('Connecté au serveur WebSocket');
  
  // Envoyer un message
  wsClient.send('position_update', {
    latitude: 48.8566,
    longitude: 2.3522,
    accuracy: 10
  });
});

// Écouter les mises à jour de position
wsClient.on('position_update', (data) => {
  console.log('Nouvelle position reçue:', data);
});

// Gérer les erreurs
wsClient.on('error', (error) => {
  console.error('Erreur WebSocket:', error);
});

// Se connecter
wsClient.connect();

// Se déconnecter (quand nécessaire)
// wsClient.disconnect();
```

## API

### `createWebSocketClient(url: string, options?: WebSocketOptions): LivreurWebSocketClient`

Crée une nouvelle instance du client WebSocket.

**Paramètres :**
- `url`: URL du serveur WebSocket (ex: `ws://localhost:3000/ws`)
- `options`: Options de configuration (optionnel)
  - `reconnectInterval`: Délai entre les tentatives de reconnexion (ms, défaut: 1000)
  - `maxReconnectAttempts`: Nombre maximum de tentatives de reconnexion (défaut: 10)
  - `debug`: Active les logs de débogage (défaut: false)
  - `autoReconnect`: Active la reconnexion automatique (défaut: true)

### Méthodes

#### `connect(): void`
Établit la connexion WebSocket.

#### `disconnect(): void`
Ferme la connexion WebSocket.

#### `send<T>(eventType: string, data: T): void`
Envoie un message au serveur.

#### `getStatus(): WebSocketStatus`
Retourne le statut actuel de la connexion.

### Événements

#### `connected`
Émis lorsque la connexion est établie.

#### `disconnected`
Émis lorsque la connexion est fermée.

#### `status`
Émis lorsque le statut de la connexion change.

#### `error`
Émis en cas d'erreur.

#### `message`
Émis à la réception d'un message.

#### Événements métier
- `position_update`: Mise à jour de position d'un livreur
- `status_update`: Changement de statut d'un livreur
- `delivery_assigned`: Livraison assignée à un livreur
- `delivery_completed`: Livraison terminée

## Développement

### Installation des dépendances

```bash
bun install
```

### Compilation

```bash
bun run build
```

### Tests

```bash
bun test
```

### Linting

```bash
bun run lint
```
