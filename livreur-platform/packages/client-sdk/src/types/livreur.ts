import { LivreurStatus, Position, ContactInfo, Metadata } from './common';

export interface Livreur {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: LivreurStatus;
  
  // Position actuelle
  currentPosition?: Position;
  lastSeenAt?: Date;
  
  // Moyen de transport
  vehicle?: {
    type: 'bike' | 'scooter' | 'car' | 'van' | 'on_foot';
    registrationNumber?: string;
    model?: string;
    color?: string;
  };
  
  // Statistiques
  stats?: {
    totalDeliveries: number;
    completedDeliveries: number;
    averageRating?: number;
    totalDistance: number; // en mètres
  };
  
  // Disponibilité
  isAvailable: boolean;
  workingHours?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  
  // Métadonnées
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface LivreurCreateInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle?: {
    type: 'bike' | 'scooter' | 'car' | 'van' | 'on_foot';
    registrationNumber?: string;
    model?: string;
    color?: string;
  };
  workingHours?: {
    [key: string]: { start: string; end: string };
  };
  metadata?: Metadata;
}

export interface LivreurUpdateInput {
  status?: LivreurStatus;
  isAvailable?: boolean;
  currentPosition?: Position;
  vehicle?: {
    type?: 'bike' | 'scooter' | 'car' | 'van' | 'on_foot';
    registrationNumber?: string;
    model?: string;
    color?: string;
  };
  workingHours?: {
    [key: string]: { start: string; end: string };
  };
  metadata?: Metadata;
}

export interface LivreurFilterParams {
  status?: LivreurStatus | LivreurStatus[];
  isAvailable?: boolean;
  vehicleType?: 'bike' | 'scooter' | 'car' | 'van' | 'on_foot';
  search?: string;
}

export interface LivreurPositionUpdate {
  livreurId: string;
  position: Position;
  status?: LivreurStatus;
  timestamp?: Date;
}
