# Contrôles de Carte Personnalisés

Ce module fournit des composants réutilisables pour ajouter des contrôles personnalisés à vos cartes Leaflet/React-Leaflet.

## Composants Disponibles

### MapControls

Un composant tout-en-un qui regroupe les contrôles de base pour une carte.

**Props :**
- `position` (optionnel) : Position des contrôles sur la carte (`'topleft' | 'topright' | 'bottomleft' | 'bottomright'`). Par défaut : `'bottomright'`
- `showLocateMe` (optionnel) : Affiche le bouton de localisation. Par défaut : `true`
- `showZoom` (optionnel) : Affiche les boutons de zoom. Par défaut : `true`
- `showResetView` (optionnel) : Affiche le bouton de réinitialisation. Par défaut : `true`
- `initialCenter` (optionnel) : Position initiale pour la réinitialisation. Par défaut : `[0, 0]`
- `initialZoom` (optionnel) : Niveau de zoom initial pour la réinitialisation. Par défaut : `2`

**Exemple d'utilisation :**

```tsx
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapControls } from './MapControls';

const MyMap = () => (
  <MapContainer 
    center={[48.8566, 2.3522]} 
    zoom={13} 
    style={{ height: '100vh', width: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <MapControls 
      position="topright"
      showLocateMe={true}
      showZoom={true}
      showResetView={true}
    />
  </MapContainer>
);
```

### MapControlButton

Un bouton de contrôle personnalisable pour la carte.

**Props :**
- `icon` : Icône ou texte à afficher dans le bouton
- `onClick` : Fonction appelée lors du clic
- `title` : Texte d'aide au survol
- `disabled` (optionnel) : Désactive le bouton. Par défaut : `false`
- `className` (optionnel) : Classe CSS personnalisée

**Exemple d'utilisation :**

```tsx
import { MapControlButton } from './MapControls';

const CustomButton = () => (
  <MapControlButton
    icon="⭐"
    onClick={() => alert('Bouton cliqué!')}
    title="Étoile"
  />
);
```

### MapControlGroup

Un conteneur pour regrouper plusieurs contrôles de carte.

**Props :**
- `position` (optionnel) : Position du groupe sur la carte. Par défaut : `'bottomright'`
- `children` : Composants enfants à afficher dans le groupe
- `className` (optionnel) : Classe CSS personnalisée

**Exemple d'utilisation :**

```tsx
import { MapControlGroup, MapControlButton } from './MapControls';

const CustomControls = () => {
  const map = useMap();
  
  const handleCustomAction = () => {
    // Action personnalisée
  };
  
  return (
    <MapControlGroup position="topleft">
      <MapControlButton 
        icon="🔍" 
        onClick={handleCustomAction} 
        title="Recherche" 
      />
      <MapControlButton 
        icon="📌" 
        onClick={() => console.log('Épingle ajoutée')} 
        title="Ajouter un repère" 
      />
    </MapControlGroup>
  );
};
```

## Personnalisation

### Styles

Vous pouvez personnaliser l'apparence des contrôles en surchargeant les styles CSS. Voici les classes disponibles :

- `.map-control-button` : Style de base des boutons
- `.map-control-group` : Conteneur des contrôles
- `.leaflet-control-zoom-{action}` : Classes spécifiques pour chaque type de bouton (remplacer {action} par le titre en minuscules avec des tirets, ex: `leaflet-control-zoom-avant`)

### Thèmes

Les composants utilisent des variables CSS pour les couleurs, ce qui permet une personnalisation facile :

```css
:root {
  --map-control-bg: #ffffff;
  --map-control-border: rgba(0, 0, 0, 0.2);
  --map-control-color: #333333;
  --map-control-hover-bg: #f4f4f4;
  --map-control-active-bg: #e8e8e8;
}
```

## Bonnes Pratiques

1. **Performance** : Les composants sont mémoïsés pour éviter les rendus inutiles.
2. **Accessibilité** : Les contrôles incluent des attributs ARIA pour une meilleure accessibilité.
3. **Responsive** : Les contrôles s'adaptent à la taille de l'écran.
4. **Théme** : Utilisez les variables CSS pour personnaliser facilement l'apparence.

## Compatibilité

- React 16.8+
- React-Leaflet 3+
- TypeScript 4.0+
- Leaflet 1.7+

## Licence

MIT
