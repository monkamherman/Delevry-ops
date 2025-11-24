import { Position } from '@livreur/core-types';

/**
 * Rayon moyen de la Terre en kilomètres
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Calcule la distance entre deux coordonnées géographiques en utilisant la formule de Haversine
 * @param from Position de départ
 * @param to Position d'arrivée
 * @returns Distance en kilomètres
 */
export function calculateDistance(from: Position, to: Position): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Convertit des degrés en radians
 * @param degrees Angle en degrés
 * @returns Angle en radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calcule le temps de trajet estimé en fonction de la distance et de la vitesse moyenne
 * @param distance Distance en kilomètres
 * @param averageSpeed Vitesse moyenne en km/h (par défaut 30 km/h en ville)
 * @returns Temps de trajet en minutes
 */
export function calculateTravelTime(distance: number, averageSpeed: number = 30): number {
  if (distance <= 0) return 0;
  if (averageSpeed <= 0) {
    throw new Error('La vitesse moyenne doit être supérieure à 0');
  }
  return (distance / averageSpeed) * 60; // Convertit en minutes
}

/**
 * Vérifie si une position est valide
 * @param position Position à vérifier
 * @returns true si la position est valide, false sinon
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.latitude >= -90 && 
    position.latitude <= 90 && 
    position.longitude >= -180 && 
    position.longitude <= 180
  );
}

/**
 * Calcule le point médian entre plusieurs positions
 * @param positions Tableau de positions
 * @returns Position médiane ou null si le tableau est vide
 */
export function calculateMidpoint(positions: Position[]): Position | null {
  if (positions.length === 0) return null;
  
  const sum = positions.reduce(
    (acc, pos) => ({
      latitude: acc.latitude + pos.latitude,
      longitude: acc.longitude + pos.longitude,
    }),
    { latitude: 0, longitude: 0 }
  );

  return {
    latitude: sum.latitude / positions.length,
    longitude: sum.longitude / positions.length,
  };
}
