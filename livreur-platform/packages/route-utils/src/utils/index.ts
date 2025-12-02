import { Position } from '@livreur/core-types';

/**
 * Calcule la distance en mètres entre deux points géographiques (formule de Haversine)
 * @param point1 Premier point (lat, lng)
 * @param point2 Deuxième point (lat, lng)
 * @returns Distance en mètres
 */
export function calculateDistance(point1: Position, point2: Position): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (point1.lat * Math.PI) / 180;
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Formate une distance en mètres en une chaîne lisible
 * @param meters Distance en mètres
 * @param unit Unité de sortie ('km' ou 'miles')
 * @returns Chaîne formatée (ex: "1.5 km")
 */
export function formatDistance(meters: number, unit: 'km' | 'miles' = 'km'): string {
  if (unit === 'miles') {
    const miles = meters * 0.000621371;
    return miles >= 0.1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`;
  } else {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    } else {
      return `${Math.round(meters)} m`;
    }
  }
}

/**
 * Formate une durée en secondes en une chaîne lisible
 * @param seconds Durée en secondes
 * @returns Chaîne formatée (ex: "2h 30min")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes} min`;
  }
}

/**
 * Vérifie si deux positions sont identiques (avec une certaine marge d'erreur)
 * @param pos1 Première position
 * @param pos2 Deuxième position
 * @param tolerance Tolérance en mètres (défaut: 10m)
 * @returns true si les positions sont considérées comme identiques
 */
export function arePositionsEqual(
  pos1: Position,
  pos2: Position,
  tolerance = 10 // 10 mètres de tolérance par défaut
): boolean {
  return calculateDistance(pos1, pos2) <= tolerance;
}

/**
 * Calcule le point médian entre deux positions
 * @param pos1 Première position
 * @param pos2 Deuxième position
 * @returns Position médiane
 */
export function getMidpoint(pos1: Position, pos2: Position): Position {
  return {
    lat: (pos1.lat + pos2.lat) / 2,
    lng: (pos1.lng + pos2.lng) / 2,
  };
}

export * from './validation';
