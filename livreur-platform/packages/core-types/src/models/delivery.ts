import { Position } from './position';
import { Livreur } from './livreur';
import { DeliveryStatus, UserRole } from '../enums';

/**
 * Représente une livraison dans le système
 */
export interface Delivery {
  /**
   * Identifiant unique de la livraison
   */
  id: string;

  /**
   * Référence unique de la livraison (format lisible)
   * @example "LIV-2023-11-24-001"
   */
  reference: string;

  /**
   * Statut actuel de la livraison
   */
  status: DeliveryStatus;

  /**
   * Détails de l'expéditeur
   */
  sender: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };

  /**
   * Détails du destinataire
   */
  recipient: {
    name: string;
    phone: string;
    email?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
      details?: string;
      position?: Position;
    };
  };

  /**
   * Détails du colis
   */
  package: {
    description: string;
    weight: number; // en kg
    dimensions?: {
      length: number; // cm
      width: number;  // cm
      height: number; // cm
    };
    estimatedValue?: number; // en euros
    requiresSignature: boolean;
    isFragile: boolean;
  };

  /**
   * Livreur assigné (si disponible)
   */
  livreur?: Pick<Livreur, 'id' | 'firstName' | 'lastName' | 'phone'>;

  /**
   * Dates importantes
   */
  timestamps: {
    createdAt: string;
    updatedAt: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    estimatedDeliveryTime?: string;
  };

  /**
   * Notes supplémentaires
   */
  notes?: string;

  /**
   * Métadonnées supplémentaires
   */
  metadata?: Record<string, unknown>;
}

/**
 * Données requises pour créer une nouvelle livraison
 */
export interface CreateDeliveryDto {
  sender: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
  };
  
  recipient: {
    name: string;
    phone: string;
    email?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
      details?: string;
      position?: Position;
    };
  };
  
  package: {
    description: string;
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    estimatedValue?: number;
    requiresSignature: boolean;
    isFragile: boolean;
  };
  
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Données pour mettre à jour une livraison existante
 */
export interface UpdateDeliveryDto {
  status?: DeliveryStatus;
  livreurId?: string | null;
  estimatedDeliveryTime?: string | null;
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Filtres pour la recherche de livraisons
 */
export interface DeliveryFilters {
  status?: DeliveryStatus | DeliveryStatus[];
  livreurId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  requiresSignature?: boolean;
  isFragile?: boolean;
}

/**
 * Options pour la mise à jour en masse des livraisons
 */
export interface BulkUpdateDeliveryDto {
  ids: string[];
  data: {
    status?: DeliveryStatus;
    livreurId?: string | null;
  };
}

/**
 * Détails de suivi d'une livraison
 */
export interface DeliveryTracking {
  deliveryId: string;
  status: DeliveryStatus;
  currentPosition?: Position;
  estimatedTimeOfArrival?: string;
  distanceRemaining?: number; // en mètres
  steps: Array<{
    status: DeliveryStatus;
    timestamp: string;
    location?: Position;
    notes?: string;
    actor?: {
      id: string;
      type: UserRole;
      name: string;
    };
  }>;
}

/**
 * Statistiques de livraison
 */
export interface DeliveryStats {
  total: number;
  byStatus: Record<DeliveryStatus, number>;
  averageDeliveryTime: number; // en minutes
  onTimePercentage: number; // 0-100
  byLivreur: Array<{
    livreurId: string;
    livreurName: string;
    count: number;
    averageRating?: number;
  }>;
  byDay: Array<{
    date: string;
    count: number;
  }>;
}