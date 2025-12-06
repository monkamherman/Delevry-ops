import { Position } from './common';

export interface RouteStep {
  distance: number; // en mètres
  duration: number; // en secondes
  instruction: string;
  name: string;
  type: string;
  modifier?: string;
  way_points: [number, number];
}

export interface Route {
  id: string;
  name?: string;
  // Points de passage (waypoints)
  waypoints: Position[];
  // Polyline encodée pour le tracé sur la carte
  polyline: string;
  // Distance totale en mètres
  distance: number;
  // Durée estimée en secondes
  duration: number;
  // Étapes détaillées
  steps?: RouteStep[];
  // Métadonnées
  metadata?: {
    [key: string]: any;
  };
  // Horodatages
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteOptimizationParams {
  // Points de départ, d'arrivée et intermédiaires
  waypoints: Array<{
    id: string;
    position: Position;
    type: 'pickup' | 'delivery' | 'break' | 'other';
    duration?: number; // Durée d'arrêt en secondes
    timeWindows?: Array<{
      start: Date | string;
      end: Date | string;
    }>;
    priority?: number; // 1-10, 10 étant la priorité la plus élevée
  }>;
  
  // Contraintes
  constraints?: {
    maxTravelTime?: number; // en secondes
    maxDistance?: number; // en mètres
    maxStops?: number;
    maxWaitTime?: number; // en secondes
  };
  
  // Options d'optimisation
  options?: {
    roundTrip?: boolean; // Retour au point de départ
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    avoidFerries?: boolean;
    departureTime?: Date | string;
    traffic?: 'enabled' | 'disabled';
  };
  
  // Métadonnées
  metadata?: {
    [key: string]: any;
  };
}

export interface RouteOptimizationResult {
  // Itinéraire optimisé
  route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>;
  
  // Statistiques
  statistics: {
    totalDistance: number; // en mètres
    totalDuration: number; // en secondes
    totalStops: number;
    totalWaitTime: number; // en secondes
    totalServiceTime: number; // en secondes
    totalTravelTime: number; // en secondes
  };
  
  // Violations de contraintes
  violations: Array<{
    type: string;
    description: string;
    stopId?: string;
    actualValue: number;
    maxAllowedValue?: number;
  }>;
  
  // Métadonnées
  metadata?: {
    [key: string]: any;
  };
}
