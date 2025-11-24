# @livreur/utils

Bibliothèque utilitaire pour la plateforme de suivi de livreurs en temps réel.

## Installation

```bash
bun add @livreur/utils
```

## Fonctionnalités

### Géolocalisation

- `calculateDistance(from, to)`: Calcule la distance entre deux positions géographiques
- `calculateTravelTime(distance, averageSpeed, trafficFactor, stopMinutes)`: Calcule le temps de trajet estimé
- `isValidPosition(position)`: Vérifie si une position est valide
- `calculateMidpoint(positions)`: Calcule le point médian entre plusieurs positions
- `calculateWeightedMidpoint(positions)`: Calcule un point médian pondéré en fonction des horodatages

### Dates

- `formatDate(date, format)`: Formate une date selon le format spécifié
- `formatDuration(minutes)`: Formate une durée en minutes en format lisible
- `formatRelativeDate(date)`: Affiche une date relative (Aujourd'hui, Hier, etc.)
- `getTimeDifferenceInMinutes(startDate, endDate)`: Calcule la différence en minutes entre deux dates
- `formatTimeRange(startDate, endDate)`: Formate une plage horaire
- `isFutureDate(date)`: Vérifie si une date est dans le futur
- `isPastDate(date)`: Vérifie si une date est dans le passé

### Validation

- `isValidEmail(email)`: Valide une adresse email
- `isValidFrenchPhoneNumber(phone)`: Valide un numéro de téléphone français
- `isValidFrenchZipCode(zipCode)`: Valide un code postal français
- `validatePassword(password)`: Vérifie la force d'un mot de passe
- `isValidSIRET(siret)`: Valide un numéro SIRET

## Utilisation

### Exemple de base

```typescript
import { calculateDistance, formatDate } from '@livreur/utils';

// Calcul de distance
const paris = { latitude: 48.8566, longitude: 2.3522 };
const lyon = { latitude: 45.7640, longitude: 4.8357 };
const distance = calculateDistance(paris, lyon); // Environ 392 km

// Formatage de date
const today = new Date();
const formattedDate = formatDate(today, 'dd/MM/yyyy'); // "24/11/2023"
```

## Types

### Position

```typescript
interface Position {
  latitude: number;  // en degrés décimaux (WGS84)
  longitude: number; // en degrés décimaux (WGS84)
  timestamp?: string; // au format ISO 8601
  accuracy?: number;  // précision en mètres
}
```

## Développement

### Exécuter les tests

```bash
bun test
```

### Linter le code

```bash
bun run lint
```

## Licence

MIT
