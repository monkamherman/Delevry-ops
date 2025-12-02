import { Position } from '@livreur/core-types';

/**
 * Calcule la boîte englobante (bounding box) d'un ensemble de positions géographiques
 * @param positions - Tableau de positions géographiques
 * @returns Un objet contenant les coins sud-ouest et nord-est de la boîte englobante
 */
export function getBoundingBox(positions: Position[]): {
  min: { lat: number; lng: number };
  max: { lat: number; lng: number };
} | null {
  if (!positions || positions.length === 0) {
    return null;
  }

  let minLat = Number.MAX_VALUE;
  let maxLat = -Number.MAX_VALUE;
  let minLng = Number.MAX_VALUE;
  let maxLng = -Number.MAX_VALUE;

  for (const pos of positions) {
    minLat = Math.min(minLat, pos.latitude);
    maxLat = Math.max(maxLat, pos.latitude);
    minLng = Math.min(minLng, pos.longitude);
    maxLng = Math.max(maxLng, pos.longitude);
  }

  return {
    min: { lat: minLat, lng: minLng },
    max: { lat: maxLat, lng: maxLng }
  };
}

/**
 * Vérifie si un point se trouve à l'intérieur d'un polygone
 * @param point - Le point à vérifier
 * @param polygon - Tableau de points formant le polygone
 * @returns true si le point est à l'intérieur du polygone
 */
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: Array<{ lat: number; lng: number }>
): boolean {
  // Algorithme du point dans un polygone (ray casting)
  let inside = false;
  const x = point.lng;
  const y = point.lat;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Vérifie si une position est à l'intérieur d'une zone géographique
 * @param position - La position à vérifier
 * @param geofence - Tableau de positions formant la zone géographique
 * @returns Un objet indiquant si le point est à l'intérieur et la distance au bord le plus proche
 */
export function getGeofenceStatus(
  position: Position,
  geofence: Position[]
): { isInside: boolean; distanceToEdge?: number } {
  // Convertir la geofence en tableau de {lat, lng}
  const polygon = geofence.map(p => ({
    lat: p.latitude,
    lng: p.longitude
  }));
  
  const point = {
    lat: position.latitude,
    lng: position.longitude
  };
  
  const inside = isPointInPolygon(point, polygon);
  
  // Pour une implémentation complète, il faudrait calculer la distance au bord le plus proche
  // Ceci est une implémentation simplifiée
  return {
    isInside: inside,
    distanceToEdge: 0 // À implémenter si nécessaire
  };
}
