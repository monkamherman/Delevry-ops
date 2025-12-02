import { Position, PositionWithId } from '@livreur/core-types';

/**
 * Vérifie si une position est valide
 * @param position Position à valider
 * @returns true si la position est valide
 */
export function isValidPosition(position: Partial<Position>): position is Position {
  return (
    typeof position.lat === 'number' &&
    typeof position.lng === 'number' &&
    position.lat >= -90 &&
    position.lat <= 90 &&
    position.lng >= -180 &&
    position.lng <= 180
  );
}

/**
 * Valide un tableau de positions
 * @param positions Tableau de positions à valider
 * @returns Tableau de positions valides avec leurs index
 */
export function validatePositions(positions: Position[]): PositionWithId[] {
  return positions
    .map((pos, index) => ({
      ...pos,
      id: index.toString(),
    }))
    .filter((pos): pos is PositionWithId => isValidPosition(pos));
}

/**
 * Vérifie si un itinéraire est valide
 * @param route Itinéraire à valider
 * @returns true si l'itinéraire est valide
 */
export function isValidRoute(route: any): route is OptimizedRoute {
  return (
    route &&
    Array.isArray(route.waypoints) &&
    route.waypoints.every(isValidPosition) &&
    typeof route.distance === 'number' &&
    typeof route.duration === 'number' &&
    typeof route.geometry === 'string' &&
    Array.isArray(route.steps)
  );
}

/**
 * Valide les options d'optimisation
 * @param options Options à valider
 * @returns Options validées avec des valeurs par défaut
 */
export function validateOptimizationOptions(
  options?: Partial<RouteOptimizerOptions>
): RouteOptimizerOptions {
  const defaultOptions: RouteOptimizerOptions = {
    profile: 'car',
    units: 'km',
    useCache: true,
    cacheTtl: 3600, // 1 heure par défaut
  };

  if (!options) {
    return defaultOptions;
  }

  return {
    ...defaultOptions,
    ...options,
  };
}
