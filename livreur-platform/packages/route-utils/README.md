# @livreur/route-utils

Bibliothèque utilitaire pour l'optimisation d'itinéraires dans la plateforme Livreur.

## Fonctionnalités

- Calcul de distances entre points géographiques
- Optimisation d'itinéraires multi-points
- Calcul de matrices de distance
- Support pour différents profils de transport (voiture, vélo, piéton, camion)
- Cache des résultats pour améliorer les performances
- Formatage des distances et durées

## Installation

```bash
bun add @livreur/route-utils
```

## Utilisation de base

### Calcul de distance entre deux points

```typescript
import { calculateDistance } from '@livreur/route-utils';

const pointA = { lat: 48.8566, lng: 2.3522 }; // Paris
const pointB = { lat: 45.7640, lng: 4.8357 }; // Lyon

const distance = calculateDistance(pointA, pointB);
console.log(`Distance: ${distance} mètres`);
```

### Création d'un optimiseur personnalisé

```typescript
import { BaseRouteOptimizer } from '@livreur/route-utils';

class CustomRouteOptimizer extends BaseRouteOptimizer {
  protected async calculateOptimizedRoute(
    waypoints: Position[],
    options: RouteOptimizerOptions
  ): Promise<OptimizedRoute> {
    // Implémentez ici la logique d'optimisation spécifique
    // Par exemple, intégration avec OSRM, VROOM, etc.
    
    // Pour l'exemple, on retourne un itinéraire direct
    return this.createDefaultRoute(waypoints);
  }
}

// Utilisation
const optimizer = new CustomRouteOptimizer({
  profile: 'car',
  useCache: true,
  cacheTtl: 3600 // 1 heure
});

const waypoints = [
  { lat: 48.8566, lng: 2.3522 },  // Paris
  { lat: 45.7640, lng: 4.8357 },  // Lyon
  { lat: 43.2965, lng: 5.3698 },  // Marseille
];

const optimizedRoute = await optimizer.optimizeRoute(waypoints);
console.log(`Distance optimisée: ${optimizedRoute.distance} mètres`);
console.log(`Durée estimée: ${optimizedRoute.duration} secondes`);
```

## API

### Fonctions utilitaires

- `calculateDistance(point1: Position, point2: Position): number` - Calcule la distance en mètres entre deux points
- `formatDistance(meters: number, unit: 'km' | 'miles' = 'km'): string` - Formate une distance en chaîne lisible
- `formatDuration(seconds: number): string` - Formate une durée en secondes en chaîne lisible
- `arePositionsEqual(pos1: Position, pos2: Position, tolerance = 10): boolean` - Vérifie si deux positions sont égales avec une certaine tolérance
- `getMidpoint(pos1: Position, pos2: Position): Position` - Calcule le point médian entre deux positions

### Classe BaseRouteOptimizer

Classe de base pour implémenter des optimiseurs d'itinéraires personnalisés.

#### Méthodes principales

- `optimizeRoute(waypoints: Position[], options?: RouteOptimizerOptions): Promise<OptimizedRoute>` - Optimise un itinéraire
- `getDistanceMatrix(points: Position[], options?): Promise<DistanceMatrix>` - Calcule une matrice de distance

#### Options

- `profile`: Profil de transport ('car', 'bike', 'foot', 'truck')
- `units`: Unité de distance ('km' ou 'miles')
- `useCache`: Active/désactive le cache (par défaut: true)
- `cacheTtl`: Durée de vie du cache en secondes (par défaut: 3600)

## Intégration avec des services externes

### OSRM

Pour utiliser OSRM, créez une classe qui étend `BaseRouteOptimizer` et implémentez la méthode `calculateOptimizedRoute` en utilisant l'API OSRM.

### VROOM

Pour utiliser VROOM, créez une classe similaire qui communique avec l'API VROOM pour l'optimisation avancée d'itinéraires.

## Développement

### Installation des dépendances

```bash
bun install
```

### Construction

```bash
bun run build
```

### Tests

```bash
bun test
```

## Licence

MIT
