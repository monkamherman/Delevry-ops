import { Position } from '@livreur/core-types';

/**
 * Rayon moyen de la Terre en kilomètres (sphère parfaite)
 * @constant
 */
const EARTH_RADIUS_KM = 6371;

// Cache pour les valeurs de sinus et cosinus précalculées
const sinCache = new Map<number, number>();
const cosCache = new Map<number, number>();

/**
 * Calcule et met en cache le sinus d'un angle en degrés
 * @param degrees Angle en degrés
 * @returns Sinus de l'angle
 */
function sinDeg(degrees: number): number {
  const key = Math.round(degrees * 1e6) / 1e6; // Arrondi à 6 décimales pour le cache
  if (!sinCache.has(key)) {
    sinCache.set(key, Math.sin(toRadians(degrees)));
  }
  return sinCache.get(key)!;
}

/**
 * Calcule et met en cache le cosinus d'un angle en degrés
 * @param degrees Angle en degrés
 * @returns Cosinus de l'angle
 */
function cosDeg(degrees: number): number {
  const key = Math.round(degrees * 1e6) / 1e6; // Arrondi à 6 décimales pour le cache
  if (!cosCache.has(key)) {
    cosCache.set(key, Math.cos(toRadians(degrees)));
  }
  return cosCache.get(key)!;
}

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
export function calculateDistance(from: Position, to: Position): number {
  // Validation des entrées
  if (!isValidPosition(from) || !isValidPosition(to)) {
    throw new Error('Positions invalides');
  }
  
  // Si c'est la même position, distance nulle
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }
  
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  
  // Formule de Haversine
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance en kilomètres, arrondie à 3 décimales (précision du mètre près)
  return Math.round(EARTH_RADIUS_KM * c * 1000) / 1000;
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
export function calculateTravelTime(
  distance: number, 
  averageSpeed: number = 30,
  trafficFactor: number = 1.0,
  stopMinutes: number = 0
): number {
  if (distance < 0) {
    throw new Error('La distance ne peut pas être négative');
  }
  if (distance === 0) return 0;
  if (averageSpeed <= 0) {
    throw new Error('La vitesse moyenne doit être supérieure à 0');
  }
  if (trafficFactor < 0.1) {
    throw new Error('Le facteur de trafic doit être positif');
  }
  
  // Temps de trajet de base en heures * facteur de trafic
  const baseTime = (distance / averageSpeed) * trafficFactor;
  
  // Conversion en minutes + arrondi à la minute supérieure
  return Math.ceil(baseTime * 60 + stopMinutes);
}

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
export function isValidPosition(position: Position): boolean {
  // Vérification des types
  if (typeof position.latitude !== 'number' || 
      typeof position.longitude !== 'number' ||
      isNaN(position.latitude) || 
      isNaN(position.longitude)) {
    return false;
  }
  // Vérification des plages
  const latValid = position.latitude >= -90 && position.latitude <= 90;
  const lngValid = position.longitude >= -180 && position.longitude <= 180;
  
  // Vérification optionnelle du timestamp
  const timeValid = position.timestamp === undefined ||
                  (position.timestamp !== null && 
                   typeof position.timestamp === 'object' &&
                   'getTime' in position.timestamp &&
                   !isNaN((position.timestamp as Date).getTime()));

  return latValid && lngValid && Boolean(timeValid);
}

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
export function calculateMidpoint(positions: Position[]): Position | null {
  if (positions.length === 0) return null;
  
  // Vérification des positions invalides
  const invalidPos = positions.find(p => !isValidPosition(p));
  if (invalidPos) {
    throw new Error('Une ou plusieurs positions sont invalides');
  }
  
  // Utilisation de reduce pour sommer efficacement
  const { sumLat, sumLon, count } = positions.reduce(
    (acc, pos) => ({
      sumLat: acc.sumLat + pos.latitude,
      sumLon: acc.sumLon + pos.longitude,
      count: acc.count + 1
    }),
    { sumLat: 0, sumLon: 0, count: 0 }
  );

  // Calcul de la moyenne avec précision
  const avgLat = sumLat / count;
  const avgLon = sumLon / count;
  
  // Arrondi à 6 décimales (précision d'environ 10 cm à l'équateur)
  return {
    latitude: parseFloat(avgLat.toFixed(6)),
    longitude: parseFloat(avgLon.toFixed(6)),
    timestamp: new Date().toISOString() // On utilise la date actuelle pour le point médian
  };
}

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
export function calculateWeightedMidpoint(positions: Position[]): Position | null {
  if (positions.length === 0) return null;
  
  // Trier par timestamp (du plus ancien au plus récent)
  const sorted = [...positions].sort((a, b) => {
    const timeA = a.timestamp && typeof a.timestamp === 'object' && 'getTime' in a.timestamp 
      ? (a.timestamp as Date).getTime() 
      : 0;
    const timeB = b.timestamp && typeof b.timestamp === 'object' && 'getTime' in b.timestamp 
      ? (b.timestamp as Date).getTime() 
      : 0;
    return timeA - timeB;
  });
  
  // Calculer les poids en fonction du temps (les plus récents ont plus de poids)
  const now = Date.now();
  const weighted = sorted.map(pos => {
    const timestamp = pos.timestamp && typeof pos.timestamp === 'object' && 'getTime' in pos.timestamp 
      ? (pos.timestamp as Date).getTime() 
      : now;
    const age = now - timestamp;
    // Poids inversement proportionnel à l'âge (en heures)
    const weight = 1 / (1 + (age / (1000 * 60 * 60)));
    return { ...pos, weight };
  });
  
  // Calcul de la somme des poids pour la normalisation
  const totalWeight = weighted.reduce((sum, pos) => sum + pos.weight, 0);
  
  // Calcul du point médian pondéré
  const { sumLat, sumLon } = weighted.reduce(
    (acc, pos) => ({
      sumLat: acc.sumLat + (pos.latitude * pos.weight),
      sumLon: acc.sumLon + (pos.longitude * pos.weight),
    }),
    { sumLat: 0, sumLon: 0 }
  );
  
  // Normalisation par le poids total
  return {
    latitude: parseFloat((sumLat / totalWeight).toFixed(6)),
    longitude: parseFloat((sumLon / totalWeight).toFixed(6)),
    timestamp: new Date().toISOString()
  };
}
