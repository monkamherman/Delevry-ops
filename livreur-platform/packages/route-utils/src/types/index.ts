import { Position } from '@livreur/core-types';

export interface RouteOptimizerOptions {
  /**
   * Profil de transport à utiliser pour le calcul d'itinéraire
   * @default 'car'
   */
  profile?: 'car' | 'bike' | 'foot' | 'truck';
  
  /**
   * Unité de distance à utiliser dans les résultats
   * @default 'km'
   */
  units?: 'km' | 'miles';
  
  /**
   * Activer le cache pour les requêtes d'optimisation
   * @default true
   */
  useCache?: boolean;
  
  /**
   * Durée de vie du cache en secondes
   * @default 3600 (1 heure)
   */
  cacheTtl?: number;
}

export interface OptimizedRoute {
  /**
   * Points de passage ordonnés de l'itinéraire
   */
  waypoints: Position[];
  
  /**
   * Distance totale en mètres
   */
  distance: number;
  
  /**
   * Durée estimée en secondes
   */
  duration: number;
  
  /**
   * Représentation encodée de l'itinéraire (polyline)
   */
  geometry: string;
  
  /**
   * Étapes détaillées de l'itinéraire
   */
  steps: RouteStep[];
}

export interface RouteStep {
  /**
   * Position de départ de l'étape
   */
  start: Position;
  
  /**
   * Position d'arrivée de l'étape
   */
  end: Position;
  
  /**
   * Distance de l'étape en mètres
   */
  distance: number;
  
  /**
   * Durée de l'étape en secondes
   */
  duration: number;
  
  /**
   * Instructions pour cette étape
   */
  instruction: string;
  
  /**
   * Nom de la voie/route
   */
  name?: string;
  
  /**
   * Type de manœuvre (tourner à gauche, tout droit, etc.)
   */
  maneuver?: {
    type: string;
    modifier?: string;
    bearing_after?: number;
    bearing_before?: number;
    location: Position;
  };
}

export interface RouteOptimizer {
  /**
   * Optimise un itinéraire en fonction des points de passage
   * @param waypoints Points de passage à visiter
   * @param options Options d'optimisation
   */
  optimizeRoute(
    waypoints: Position[], 
    options?: RouteOptimizerOptions
  ): Promise<OptimizedRoute>;
  
  /**
   * Calcule la matrice de distance entre plusieurs points
   * @param points Points pour la matrice de distance
   * @param options Options de calcul
   */
  getDistanceMatrix(
    points: Position[], 
    options?: {
      profile?: 'car' | 'bike' | 'foot' | 'truck';
      sources?: number[];
      destinations?: number[];
    }
  ): Promise<{
    distances: number[][];
    durations: number[][];
    sources: Position[];
    destinations: Position[];
  }>;
}
