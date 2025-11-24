import { Position } from '@livreur/core-types';
/**
 * Calcule la distance entre deux coordonnées géographiques en utilisant la formule de Haversine
 * @param from Position de départ
 * @param to Position d'arrivée
 * @returns Distance en kilomètres
 */
export declare function calculateDistance(from: Position, to: Position): number;
/**
 * Calcule le temps de trajet estimé en fonction de la distance et de la vitesse moyenne
 * @param distance Distance en kilomètres
 * @param averageSpeed Vitesse moyenne en km/h (par défaut 30 km/h en ville)
 * @returns Temps de trajet en minutes
 */
export declare function calculateTravelTime(distance: number, averageSpeed?: number): number;
/**
 * Vérifie si une position est valide
 * @param position Position à vérifier
 * @returns true si la position est valide, false sinon
 */
export declare function isValidPosition(position: Position): boolean;
/**
 * Calcule le point médian entre plusieurs positions
 * @param positions Tableau de positions
 * @returns Position médiane ou null si le tableau est vide
 */
export declare function calculateMidpoint(positions: Position[]): Position | null;
