import { Position } from '@livreur/core-types';
/**
 * Calcule la distance entre deux coordonnées géographiques en utilisant la formule de Haversine
 * optimisée avec mise en cache des calculs trigonométriques.
 *
 * @example
 * ```typescript
 * const paris = { latitude: 48.8566, longitude: 2.3522, timestamp: new Date() };
 * const lyon = { latitude: 45.7640, longitude: 4.8357, timestamp: new Date() };
 * const distance = calculateDistance(paris, lyon); // Environ 392 km
 * ```
 *
 * @param from Position de départ
 * @param to Position d'arrivée
 * @returns Distance en kilomètres, arrondie à 3 décimales
 * @throws {Error} Si l'une des positions est invalide
 */
export declare function calculateDistance(from: Position, to: Position): number;
/**
 * Calcule le temps de trajet estimé en fonction de la distance et de la vitesse moyenne.
 * Prend en compte un facteur de trafic et des arrêts éventuels.
 *
 * @example
 * ```typescript
 * // Temps pour parcourir 30 km à 60 km/h
 * const temps = calculateTravelTime(30, 60); // 30 minutes
 *
 * // Avec facteur de trafic (1.5 = 50% de temps en plus)
 * const tempsAvecTrafic = calculateTravelTime(30, 60, 1.5); // 45 minutes
 * ```
 *
 * @param distance Distance en kilomètres (doit être positive)
 * @param averageSpeed Vitesse moyenne en km/h (par défaut 30 km/h en ville)
 * @param trafficFactor Facteur de trafic (1 = aucun trafic, 1.5 = 50% de temps en plus, etc.)
 * @param stopMinutes Temps d'arrêt en minutes (feux, embouteillages, etc.)
 * @returns Temps de trajet en minutes, arrondi à la minute supérieure
 * @throws {Error} Si la distance ou la vitesse est négative
 */
export declare function calculateTravelTime(distance: number, averageSpeed?: number, trafficFactor?: number, stopMinutes?: number): number;
/**
 * Vérifie si une position géographique est valide.
 * Une position est considérée comme valide si :
 * - La latitude est entre -90 et 90 degrés
 * - La longitude est entre -180 et 180 degrés
 * - Le timestamp est une date valide (si fourni)
 *
 * @example
 * ```typescript
 * const positionValide = { latitude: 48.8566, longitude: 2.3522, timestamp: new Date() };
 * console.log(isValidPosition(positionValide)); // true
 *
 * const positionInvalide = { latitude: 91, longitude: 0, timestamp: new Date() };
 * console.log(isValidPosition(positionInvalide)); // false
 * ```
 *
 * @param position Position à vérifier
 * @returns true si la position est valide, false sinon
 */
export declare function isValidPosition(position: Position): boolean;
/**
 * Calcule le point médian (centroïde) entre plusieurs positions géographiques.
 * Pour des calculs plus précis sur de longues distances, utilisez calculateWeightedMidpoint.
{{ ... }}
 * @example
 * ```typescript
 * const positions = [
 *   { latitude: 48.8566, longitude: 2.3522, timestamp: new Date() }, // Paris
 *   { latitude: 45.7640, longitude: 4.8357, timestamp: new Date() }, // Lyon
 *   { latitude: 43.2965, longitude: 5.3698, timestamp: new Date() }  // Marseille
 * ];
 *
 * const centre = calculateMidpoint(positions);
 * console.log(centre); // { latitude: 45.9724, longitude: 4.1859 }
 * ```
 *
 * @param positions Tableau de positions (doit contenir au moins une position valide)
 * @returns Position médiane ou null si le tableau est vide
 * @throws {Error} Si une des positions est invalide
 */
export declare function calculateMidpoint(positions: Position[]): Position | null;
/**
 * Calcule un point médian pondéré en fonction des horodatages des positions.
 * Utile pour donner plus de poids aux positions récentes.
 *
 * @example
 * ```typescript
 * const maintenant = new Date();
 * const positions = [
 *   { latitude: 48.8566, longitude: 2.3522, timestamp: new Date(maintenant.getTime() - 3600000) }, // Il y a 1h
 *   { latitude: 45.7640, longitude: 4.8357, timestamp: maintenant } // Maintenant
 * ];
 *
 * // Le point récent aura plus de poids
 * const centrePondere = calculateWeightedMidpoint(positions);
 * ```
 *
 * @param positions Tableau de positions avec des timestamps
 * @returns Position médiane pondérée ou null si le tableau est vide
 */
export declare function calculateWeightedMidpoint(positions: Position[]): Position | null;
