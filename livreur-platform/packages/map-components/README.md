# @livreur/map-components

Bibliothèque de composants React pour l'affichage cartographique de la plateforme Livreur. Ce package fournit des composants réutilisables pour afficher des cartes interactives, suivre des livreurs en temps réel, afficher des itinéraires optimisés et gérer les livraisons.

## 📦 Installation

```bash
# Avec bun (recommandé)
bun add @livreur/map-components leaflet react-leaflet

# Avec npm
npm install @livreur/map-components leaflet react-leaflet

# Avec yarn
yarn add @livreur/map-components leaflet react-leaflet
```

## ⚙️ Prérequis

- React 18.0.0 ou supérieur
- React DOM 18.0.0 ou supérieur
- Leaflet 1.9.4 ou supérieur
- React-Leaflet 4.2.1 ou supérieur

## 🚀 Utilisation

### Configuration CSS

Ajoutez le CSS de Leaflet dans votre fichier d'entrée (généralement `main.tsx` ou `App.tsx`) :

```tsx
import 'leaflet/dist/leaflet.css';
```

### Exemple de base

```tsx
import { LiveTrackingMap } from '@livreur/map-components';

function App() {
  const center = [48.8566, 2.3522]; // Paris
  
  const deliveries = [
    {
      id: 'delivery-1',
      position: { lat: 48.8566, lng: 2.3522 },
      status: 'pending',
      address: '10 Rue de la Paix, 75002 Paris',
      recipientName: 'Jean Dupont',
    },
  ];

  const livreurs = [
    {
      id: 'livreur-1',
      name: 'Thomas Martin',
      position: { lat: 48.8534, lng: 2.3488 },
      status: 'on-delivery',
      vehicleType: 'bike',
      lastUpdated: new Date(),
      currentDeliveryId: 'delivery-1',
    },
  ];

  const routes = [
    {
      id: 'route-1',
      segments: [
        {
          from: { lat: 48.8534, lng: 2.3488 },
          to: { lat: 48.8566, lng: 2.3522 },
          distance: 500,
          duration: 300,
          instructions: 'Prendre à droite sur Rue de Rivoli',
        },
      ],
      totalDistance: 500,
      totalDuration: 300,
      waypoints: [
        [48.8534, 2.3488],
        [48.8566, 2.3522],
      ],
      polyline: JSON.stringify([
        [48.8534, 2.3488],
        [48.854, 2.35],
        [48.8566, 2.3522],
      ]),
    },
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <LiveTrackingMap 
        center={center}
        zoom={13}
        deliveries={deliveries}
        livreurs={livreurs}
        routes={routes}
        onDeliveryClick={(delivery) => console.log('Delivery clicked:', delivery)}
        onLivreurClick={(livreur) => console.log('Livreur clicked:', livreur)}
        onRouteClick={(route) => console.log('Route clicked:', route)}
      />
    </div>
  );
}

export default App;
```

## 📚 Composants

### LiveTrackingMap

Le composant principal qui affiche la carte avec les livraisons, les livreurs et les itinéraires.

#### Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `center` | `[number, number]` | ✅ | Centre initial de la carte `[lat, lng]` |
| `zoom` | `number` | ❌ | Niveau de zoom initial (défaut: `13`) |
| `deliveries` | `Delivery[]` | ❌ | Tableau des livraisons à afficher |
| `livreurs` | `Livreur[]` | ❌ | Tableau des livreurs à afficher |
| `routes` | `Route[]` | ❌ | Tableau des itinéraires à afficher |
| `onPositionUpdate` | `(position: Position) => void` | ❌ | Callback appelé lorsque la position de la carte change |
| `onDeliveryClick` | `(delivery: Delivery) => void` | ❌ | Callback appelé lors du clic sur une livraison |
| `onLivreurClick` | `(livreur: Livreur) => void` | ❌ | Callback appelé lors du clic sur un livreur |
| `onRouteClick` | `(route: Route) => void` | ❌ | Callback appelé lors du clic sur un itinéraire |
| `className` | `string` | ❌ | Classe CSS personnalisée |
| `style` | `React.CSSProperties` | ❌ | Styles CSS personnalisés |
| `showControls` | `boolean` | ❌ | Afficher les contrôles de la carte (défaut: `true`) |
| `minZoom` | `number` | ❌ | Zoom minimum autorisé |
| `maxZoom` | `number` | ❌ | Zoom maximum autorisé |
| `maxBounds` | `LatLngBoundsExpression` | ❌ | Limites de la carte |
| `zoomControl` | `boolean` | ❌ | Afficher le contrôle de zoom (défaut: `true`) |
| `scrollWheelZoom` | `boolean \| 'center'` | ❌ | Activer le zoom avec la molette (défaut: `true`) |

### LivreurMarker

Composant pour afficher un marqueur de livreur sur la carte.

### DeliveryMarkers

Composant pour afficher les marqueurs de livraison sur la carte.

### RoutePolyline

Composant pour afficher un itinéraire sur la carte.

## 🛠 Développement

### Installation des dépendances

```bash
bun install
```

### Démarrage du mode développement

```bash
bun run dev
```

### Construction du package

```bash
bun run build
```

### Lancement de Storybook

```bash
bun run storybook
```

### Construction de la documentation

```bash
bun run build-storybook
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
```

## Composants

### MapContainer

Le conteneur principal de la carte.

**Props :**
- `center`: Position centrale de la carte (obligatoire)
- `zoom`: Niveau de zoom (défaut: 13)
- `style`: Styles CSS pour le conteneur
- `className`: Classe CSS pour le conteneur

### Marker

Affiche un marqueur sur la carte.

**Props :**
- `position`: Position du marqueur (obligatoire)
- `icon`: Icône personnalisée (par défaut: marqueur Leaflet standard)
- `draggable`: Si le marqueur peut être déplacé (défaut: false)
- `title`: Texte affiché au survol
- `onClick`: Gestionnaire de clic
- `onDragEnd`: Gestionnaire de fin de déplacement

### Polyline

Affiche une ligne sur la carte.

**Props :**
- `positions`: Tableau de positions (obligatoire)
- `color`: Couleur de la ligne (défaut: '#3388ff')
- `weight`: Épaisseur de la ligne (défaut: 3)
- `opacity`: Opacité (défaut: 1)
- `dashArray`: Motif de tirets (ex: '5, 5' pour une ligne pointillée)
- `lineCap`: Style des extrémités (défaut: 'round')
- `lineJoin`: Style des jonctions (défaut: 'round')
- `onClick`: Gestionnaire de clic

## Hooks

### useMap

Hook personnalisé pour interagir avec la carte.

```tsx
import { useMap } from '@livreur/map-components';

function MyComponent() {
  const { map, setView, fitBounds } = useMap();
  
  // Centrer la carte sur une position
  const handleClick = () => {
    setView([51.5, -0.09], 15);
  };
  
  // Ajuster la vue pour afficher plusieurs marqueurs
  const showAllMarkers = () => {
    const bounds = L.latLngBounds([
      [51.5, -0.1],
      [51.52, -0.12],
    ]);
    fitBounds(bounds);
  };
  
  return (
    <div>
      <button onClick={handleClick}>Centrer la carte</button>
      <button onClick={showAllMarkers}>Afficher tout</button>
    </div>
  );
}
```

## Développement

### Installation des dépendances

```bash
bun install
```

### Construction

```bash
bun run build
```

### Développement

```bash
bun run dev
```

## Licence

MIT
