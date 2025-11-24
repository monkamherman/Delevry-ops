import { Position } from './position';
import { Delivery } from './delivery';
import { Livreur } from './livreur';

/**
 * Représente un itinéraire optimisé pour un livreur
 */
export interface OptimizedRoute {
  /**
   * Identifiant unique de l'itinéraire
   */
  id: string;

  /**
   * Livreur assigné à cet itinéraire
   */
  livreur: Pick<Livreur, 'id' | 'firstName' | 'lastName'>;

  /**
   * Date de création de l'itinéraire
   */
  createdAt: string;

  /**
   * Date prévue de départ
   */
  scheduledStartTime: string;

  /**
   * Statut de l'itinéraire
   */
  status: RouteStatus;

  /**
   * Liste des points d'arrêt dans l'ordre de passage
   */
  waypoints: RouteWaypoint[];

  /**
   * Résumé des statistiques de l'itinéraire
   */
  summary: {
    /**
     * Distance totale en mètres
     */
    totalDistance: number;

    /**
     * Durée totale estimée en secondes
     */
    totalDuration: number;

    /**
     * Nombre total de livraisons
     */
    totalDeliveries: number;

    /**
     * Nombre de livraisons complétées
     */
    completedDeliveries: number;
  };

  /**
   * Données de tracé de l'itinéraire (si disponible)
   */
  geometry?: {
    /**
     * Encodage polyline de l'itinéraire
     * @see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
     */
    polyline: string;

    /**
     * Niveau de zoom recommandé pour l'affichage
     */
    zoomLevel?: number;

    /**
     * Rectangle englobant l'itinéraire [sud-ouest, nord-est]
     */
    bounds?: [Position, Position];
  };

  /**
   * Métadonnées supplémentaires
   */
  metadata?: Record<string, unknown>;
}

/**
 * Statuts possibles d'un itinéraire
 */
export enum RouteStatus {
  /**
   * L'itinéraire est en cours de calcul
   */
  CALCULATING = 'CALCULATING',
  
  /**
   * L'itinéraire est planifié mais n'a pas encore commencé
   */
  PLANNED = 'PLANNED',
  
  /**
   * Le livreur a commencé l'itinéraire
   */
  IN_PROGRESS = 'IN_PROGRESS',
  
  /**
   * L'itinéraire est terminé
   */
  COMPLETED = 'COMPLETED',
  
  /**
   * L'itinéraire a été annulé
   */
  CANCELLED = 'CANCELLED',
  
  /**
   * L'itinéraire a échoué (ex: problème de calcul)
   */
  FAILED = 'FAILED'
}

/**
 * Un point d'arrêt dans un itinéraire
 */
export interface RouteWaypoint {
  /**
   * Type de point d'arrêt
   */
  type: 'PICKUP' | 'DELIVERY' | 'BREAK' | 'OTHER';

  /**
   * Position géographique du point d'arrêt
   */
  position: Position;

  /**
   * Adresse lisible
   */
  address: string;

  /**
   * Référence à la livraison associée (si applicable)
   */
  deliveryId?: string;

  /**
   * Ordre de passage dans l'itinéraire (commence à 1)
   */
  sequence: number;

  /**
   * Durée estimée de l'arrêt en secondes
   */
  stopDuration: number;

  /**
   * Distance depuis le point précédent en mètres
   */
  distanceFromPrevious: number;

  /**
   * Durée estimée depuis le point précédent en secondes
   */
  durationFromPrevious: number;

  /**
   * Instructions pour le livreur
   */
  instructions?: string;

  /**
   * Statut du point d'arrêt
   */
  status: WaypointStatus;

  /**
   * Horodatage de l'arrivée prévue
   */
  estimatedArrivalTime: string;

  /**
   * Horodatage de l'arrivée réelle (si disponible)
   */
  actualArrivalTime?: string;

  /**
   * Horodatage du départ (si disponible)
   */
  departureTime?: string;

  /**
   * Notes du livreur
   */
  notes?: string;
}

/**
 * Statuts possibles d'un point d'arrêt
 */
export enum WaypointStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED'
}

/**
 * Options pour l'optimisation d'itinéraire
 */
export interface RouteOptimizationOptions {
  /**
   * Contraintes temporelles
   */
  timeWindows?: Array<{
    /**
     * Heure de début de la fenêtre (ISO string)
     */
    start: string;
    
    /**
     * Heure de fin de la fenêtre (ISO string)
     */
    end: string;
  }>;

  /**
   * Contraintes de capacité (ex: poids total, volume)
   */
  capacityConstraints?: Array<{
    type: 'WEIGHT' | 'VOLUME' | 'ITEMS';
    max: number;
    current: number;
  }>;

  /**
   * Préférences d'optimisation
   */
  preferences?: {
    /**
     * Optimiser pour le temps le plus court
     */
    minimizeTime?: boolean;
    
    /**
     * Optimiser pour la distance la plus courte
     */
    minimizeDistance?: boolean;
    
    /**
     * Éviter les péages
     */
    avoidTolls?: boolean;
    
    /**
     * Éviter les autoroutes
     */
    avoidHighways?: boolean;
  };

  /**
   * Points de passage obligatoires dans un ordre spécifique
   */
  waypoints?: Array<{
    position: Position;
    type: 'PICKUP' | 'DELIVERY' | 'BREAK';
    duration?: number;
    timeWindow?: {
      start: string;
      end: string;
    };
  }>;
}

/**
 * Résultat d'une optimisation d'itinéraire
 */
export interface RouteOptimizationResult {
  /**
   * Indique si l'optimisation a réussi
   */
  success: boolean;

  /**
   * Itinéraire optimisé (si succès)
   */
  route?: OptimizedRoute;

  /**
   * Message d'erreur (en cas d'échec)
   */
  error?: string;

  /**
   * Détails de l'optimisation
   */
  metrics?: {
    /**
     * Temps de calcul en millisecondes
     */
    calculationTime: number;
    
    /**
     * Nombre d'itérations effectuées
     */
    iterations?: number;
    
    /**
     * Distance totale avant optimisation (en mètres)
     */
    initialDistance?: number;
    
    /**
     * Distance totale après optimisation (en mètres)
     */
    optimizedDistance?: number;
    
    /**
     * Pourcentage d'amélioration
     */
    improvementPercentage?: number;
  };
}