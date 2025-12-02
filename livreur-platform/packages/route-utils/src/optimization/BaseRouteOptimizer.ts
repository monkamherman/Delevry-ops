import { RouteOptimizer, RouteOptimizerOptions, OptimizedRoute, RouteStep } from '../types';
import { Position } from '@livreur/core-types';
import { calculateDistance, formatDistance, formatDuration } from '../utils';

/**
 * Implémentation de base de l'optimiseur d'itinéraires
 * Cette classe peut être étendue pour implémenter des optimiseurs spécifiques (OSRM, Google Maps, etc.)
 */
export abstract class BaseRouteOptimizer implements RouteOptimizer {
  protected options: Required<RouteOptimizerOptions>;
  private cache: Map<string, OptimizedRoute> = new Map();

  constructor(options: RouteOptimizerOptions = {}) {
    this.options = {
      profile: 'car',
      units: 'km',
      useCache: true,
      cacheTtl: 3600, // 1 heure par défaut
      ...options,
    };
  }

  /**
   * Méthode abstraite à implémenter par les classes filles
   * pour calculer l'itinéraire optimisé
   */
  protected abstract calculateOptimizedRoute(
    waypoints: Position[],
    options: RouteOptimizerOptions
  ): Promise<OptimizedRoute>;

  /**
   * Optimise un itinéraire en fonction des points de passage
   */
  public async optimizeRoute(
    waypoints: Position[],
    options: RouteOptimizerOptions = {}
  ): Promise<OptimizedRoute> {
    if (waypoints.length < 2) {
      throw new Error('At least two waypoints are required to optimize a route');
    }

    const mergedOptions = { ...this.options, ...options };
    const cacheKey = this.generateCacheKey(waypoints, mergedOptions);

    // Vérifier le cache si activé
    if (mergedOptions.useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Calculer l'itinéraire optimisé
    const optimizedRoute = await this.calculateOptimizedRoute(waypoints, mergedOptions);

    // Mettre en cache si nécessaire
    if (mergedOptions.useCache) {
      this.cache.set(cacheKey, optimizedRoute);
      
      // Nettoyer le cache après le temps défini
      if (mergedOptions.cacheTtl > 0) {
        setTimeout(() => {
          this.cache.delete(cacheKey);
        }, mergedOptions.cacheTtl * 1000);
      }
    }

    return optimizedRoute;
  }

  /**
   * Calcule la matrice de distance entre plusieurs points
   * Cette implémentation utilise la distance à vol d'oiseau
   * Peut être surchargée par les classes filles pour utiliser des services plus précis
   */
  public async getDistanceMatrix(
    points: Position[],
    options: {
      profile?: 'car' | 'bike' | 'foot' | 'truck';
      sources?: number[];
      destinations?: number[];
    } = {}
  ) {
    const { sources = [], destinations = [] } = options;
    const sourceIndices = sources.length > 0 ? sources : Array.from({ length: points.length }, (_, i) => i);
    const destIndices = destinations.length > 0 ? destinations : Array.from({ length: points.length }, (_, i) => i);

    const distances: number[][] = [];
    const durations: number[][] = [];

    for (const i of sourceIndices) {
      const source = points[i];
      const rowDistances: number[] = [];
      const rowDurations: number[] = [];

      for (const j of destIndices) {
        if (i === j) {
          rowDistances.push(0);
          rowDurations.push(0);
        } else {
          const dest = points[j];
          const distance = calculateDistance(source, dest);
          // Estimation très basique de la durée (vitesse moyenne de 50 km/h)
          const duration = (distance / 50000) * 3600; // en secondes
          
          rowDistances.push(distance);
          rowDurations.push(duration);
        }
      }

      distances.push(rowDistances);
      durations.push(rowDurations);
    }

    return {
      distances,
      durations,
      sources: sourceIndices.map(i => points[i]),
      destinations: destIndices.map(i => points[i]),
    };
  }

  /**
   * Génère une clé de cache pour un ensemble de points et d'options
   */
  private generateCacheKey(waypoints: Position[], options: RouteOptimizerOptions): string {
    const coords = waypoints
      .map(p => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`)
      .join('|');
    
    return `${options.profile}:${options.units}:${coords}`;
  }

  /**
   * Formate une distance selon les unités configurées
   */
  protected formatDistance(meters: number): string {
    return formatDistance(meters, this.options.units);
  }

  /**
   * Formate une durée en secondes en une chaîne lisible
   */
  protected formatDuration(seconds: number): string {
    return formatDuration(seconds);
  }

  /**
   * Crée un itinéraire avec des valeurs par défaut
   */
  protected createDefaultRoute(waypoints: Position[]): OptimizedRoute {
    // Créer un itinéraire direct (non optimisé) comme solution de repli
    const steps: RouteStep[] = [];
    let totalDistance = 0;
    let totalDuration = 0;

    // Créer des étapes entre chaque paire de points consécutifs
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i];
      const end = waypoints[i + 1];
      const distance = calculateDistance(start, end);
      // Estimation de durée basée sur une vitesse moyenne
      const duration = (distance / 50000) * 3600; // 50 km/h en m/s

      steps.push({
        start,
        end,
        distance,
        duration,
        instruction: `Aller vers le point ${i + 2}`,
      });

      totalDistance += distance;
      totalDuration += duration;
    }

    // Créer une géométrie simplifiée (juste les points de passage)
    const geometry = this.encodePolyline(waypoints);

    return {
      waypoints: [...waypoints],
      distance: totalDistance,
      duration: totalDuration,
      geometry,
      steps,
    };
  }

  /**
   * Encode une liste de positions en une chaîne polyline
   * Implémentation simplifiée de l'encodage polyline
   */
  private encodePolyline(points: Position[]): string {
    // Implémentation simplifiée - dans un cas réel, utiliser une bibliothèque comme @mapbox/polyline
    return points.map(p => `${p.lat},${p.lng}`).join('|');
  }
}
