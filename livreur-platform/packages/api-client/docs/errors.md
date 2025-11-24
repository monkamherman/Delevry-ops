# Gestion des erreurs

Ce document décrit les différents types d'erreurs que peut renvoyer l'API et comment les gérer dans votre application.

## Structure d'une erreur API

Toutes les erreurs renvoyées par l'API suivent le format suivant :

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur lisible par l'humain",
    "details": {
      // Détails supplémentaires sur l'erreur (optionnel)
    },
    "errors": {
      // Erreurs de validation par champ (optionnel)
      "fieldName": ["erreur 1", "erreur 2"]
    },
    "timestamp": "2023-04-01T12:00:00Z"
  }
}
```

## Codes d'erreur courants

### Erreurs d'authentification (4xx)

| Code | Description | Actions recommandées |
|------|-------------|----------------------|
| `UNAUTHORIZED` | L'utilisateur n'est pas authentifié | Rediriger vers la page de connexion |
| `INVALID_CREDENTIALS` | Identifiants invalides | Afficher un message d'erreur à l'utilisateur |
| `INVALID_TOKEN` | Token d'accès invalide ou expiré | Rafraîchir le token ou déconnecter l'utilisateur |
| `REFRESH_TOKEN_EXPIRED` | Le token de rafraîchissement a expiré | Déconnecter l'utilisateur |
| `PERMISSION_DENIED` | L'utilisateur n'a pas les permissions nécessaires | Afficher une erreur d'autorisation |

### Erreurs de validation (4xx)

| Code | Description | Actions recommandées |
|------|-------------|----------------------|
| `VALIDATION_ERROR` | Erreur de validation des données | Afficher les erreurs de validation dans le formulaire |
| `INVALID_INPUT` | Données d'entrée invalides | Vérifier les données envoyées |
| `REQUIRED_FIELD` | Champ obligatoire manquant | Mettre en évidence les champs manquants |

### Erreurs de ressource (4xx)

| Code | Description | Actions recommandées |
|------|-------------|----------------------|
| `NOT_FOUND` | Ressource introuvable | Afficher une page 404 |
| `RESOURCE_EXISTS` | La ressource existe déjà | Modifier les données pour éviter les doublons |
| `RESOURCE_IN_USE` | La ressource est utilisée ailleurs | Libérer la ressource avant de réessayer |

### Erreurs de serveur (5xx)

| Code | Description | Actions recommandées |
|------|-------------|----------------------|
| `INTERNAL_SERVER_ERROR` | Erreur interne du serveur | Réessayer plus tard ou contacter le support |
| `SERVICE_UNAVAILABLE` | Service temporairement indisponible | Réessayer plus tard |
| `TIMEOUT` | Délai d'attente dépassé | Vérifier la connexion et réessayer |

## Gestion des erreurs dans le client

Le client HTTP fournit plusieurs mécanismes pour gérer les erreurs :

### Interception des erreurs

```typescript
import { HttpClient, ApiError } from '@livreur/api-client';

const client = new HttpClient({
  baseURL: 'https://api.livreur.fr/v1',
  onError: (error: ApiError) => {
    // Gestion globale des erreurs
    if (error.status === 401) {
      // Rediriger vers la page de connexion
      redirectToLogin();
    }
    
    // Journalisation des erreurs
    logError(error);
  }
});
```

### Gestion des erreurs par requête

```typescript
try {
  const response = await client.get('/resource');
  // Traiter la réponse
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    // Gérer l'erreur 404
  } else if (error.status === 500) {
    // Gérer l'erreur serveur
  } else {
    // Gérer les autres erreurs
  }
}
```

### Validation des réponses

```typescript
import { z } from 'zod';
import { responseValidator } from '@livreur/api-client';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

try {
  const response = await client.get('/user/123');
  const user = responseValidator.validate(response.data, userSchema);
} catch (error) {
  if (error.name === 'ValidationError') {
    // Gérer les erreurs de validation
    console.error('Données utilisateur invalides:', error.issues);
  }
}
```

## Bonnes pratiques

1. **Toujours vérifier le code de statut HTTP** : Ne vous fiez pas uniquement au message d'erreur.
2. **Utiliser les codes d'erreur** pour une logique conditionnelle plutôt que les messages.
3. **Afficher des messages conviviaux** basés sur le code d'erreur.
4. **Journaliser les erreurs** côté client pour le débogage.
5. **Gérer les erreurs réseau** et les timeouts de manière élégante.
6. **Mettre en place une stratégie de réessai** pour les erreurs temporaires.

## Exemple complet

```typescript
import { HttpClient, ApiError } from '@livreur/api-client';

const client = new HttpClient({
  baseURL: 'https://api.livreur.fr/v1',
  onError: (error) => {
    logError(error);
    
    if (error.status === 401) {
      // Rediriger vers la page de connexion
      redirectToLogin();
    }
  }
});

async function fetchUser(userId: string) {
  try {
    const response = await client.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      showToast('Utilisateur non trouvé');
    } else if (error.status >= 500) {
      showToast('Erreur serveur. Veuillez réessayer plus tard.');
    } else {
      showToast('Une erreur est survenue');
    }
    
    // Relancer l'erreur pour une gestion plus poussée si nécessaire
    throw error;
  }
}
```
