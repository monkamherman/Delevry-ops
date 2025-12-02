# @livreur/core-types

Bibliothèque de types partagés pour la plateforme de suivi de livreurs en temps réel.

## 📦 Installation

```bash
bun add @livreur/core-types
```

## 📚 Documentation

### Génération de la documentation

La documentation est générée avec [TypeDoc](https://typedoc.org/).

1. **Installer les dépendances** (si ce n'est pas déjà fait) :
   ```bash
   bun install
   ```

2. **Générer la documentation** :
   ```bash
   bun run docs:generate
   ```

3. **Servir la documentation localement** :
   ```bash
   bun run docs:serve
   ```
   Puis ouvrez votre navigateur à l'adresse : http://localhost:8080

### Structure des modèles

- **Position** : Gestion des coordonnées géographiques
- **Livreur** : Gestion des livreurs et de leur statut
- **Customer** : Gestion des clients et de leurs préférences
- **Delivery** : Gestion du cycle de vie des livraisons
- **OptimizedRoute** : Gestion des itinéraires optimisés

## 🚀 Utilisation

### Exemple d'utilisation des modèles

Voir le fichier [examples/index.ts](./examples/index.ts) pour des exemples complets.

```typescript
import { Livreur, LivreurStatus, Position } from '@livreur/core-types';

// Création d'une position
const position: Position = {
  latitude: 48.8566,
  longitude: 2.3522,
  accuracy: 10,
  timestamp: new Date().toISOString()
};

// Création d'un livreur
const livreur: Livreur = {
  id: 'liv-12345',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '+33612345678',
  status: LivreurStatus.AVAILABLE,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
```

## 📝 Types et interfaces

### Énumérations

- `LivreurStatus` : Statuts possibles d'un livreur (PENDING, AVAILABLE, ON_DELIVERY, OFFLINE)
- `DeliveryStatus` : Statuts d'une livraison (PENDING, ASSIGNED, IN_PROGRESS, etc.)
- `VehicleType` : Types de véhicules disponibles
- `UserRole` : Rôles des utilisateurs dans le système

### Interfaces principales

- `Position` : Coordonnées géographiques
- `Livreur` : Informations sur un livreur
- `Customer` : Informations sur un client
- `Delivery` : Détails d'une livraison
- `OptimizedRoute` : Itinéraire optimisé pour les livraisons

## 🔧 Développement

### Scripts disponibles

- `build` : Compile le code TypeScript
- `test` : Exécute les tests
- `lint` : Vérifie le code avec ESLint
- `docs:generate` : Génère la documentation
- `docs:serve` : Lance un serveur local pour la documentation

### Structure des dossiers

```
core-types/
├── dist/           # Fichiers compilés
├── docs/           # Documentation générée
├── examples/       # Exemples d'utilisation
├── src/
│   ├── models/     # Modèles de données
│   ├── interfaces/ # Interfaces TypeScript
│   ├── enums/      # Énumérations
│   ├── constants/  # Constantes
│   └── events.ts   # Événements du système
└── tests/          # Tests unitaires
```

## 📄 Licence

MIT
