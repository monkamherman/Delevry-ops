# @livreur/map-components

Bibliothèque de composants React pour l'affichage cartographique de la plateforme Livreur.

## Installation

```bash
bun add @livreur/map-components leaflet react-leaflet
```

## Prérequis

Assurez-vous d'avoir les dépendances peer installées :
- react (^18.0.0)
- react-dom (^18.0.0)
- leaflet (^1.9.4)
- react-leaflet (^4.2.1)

## Utilisation

### Configuration CSS

Ajoutez le CSS de Leaflet dans votre fichier d'entrée :

```js
import 'leaflet/dist/leaflet.css';
```

### Exemple de base

```tsx
import { MapContainer, Marker, Polyline } from '@livreur/map-components';

function App() {
  const position = [51.505, -0.09];
  const path = [
    [51.5, -0.1],
    [51.5, -0.12],
    [51.52, -0.12],
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={position} zoom={13}>
        <Marker position={position} title="Point d'intérêt" />
        <Polyline positions={path} color="red" />
      </MapContainer>
    </div>
  );
}
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
