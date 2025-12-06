import { DeliveryStatus, TimeWindow, Address, ContactInfo, Position, Metadata } from './common';

export interface DeliveryItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  weight?: number; // en grammes
  dimensions?: {
    length?: number; // en cm
    width?: number;  // en cm
    height?: number; // en cm
  };
  barcode?: string;
  metadata?: Metadata;
}

export interface Delivery {
  id: string;
  reference: string;
  status: DeliveryStatus;
  priority: 'low' | 'normal' | 'high';
  
  // Adresses
  pickup: {
    address: Address;
    contact: ContactInfo;
    timeWindow: TimeWindow;
    notes?: string;
  };
  
  dropoff: {
    address: Address;
    contact: ContactInfo;
    timeWindow: TimeWindow;
    notes?: string;
  };
  
  // Détails de la livraison
  items?: DeliveryItem[];
  totalWeight?: number; // en grammes
  totalVolume?: number; // en cm³
  
  // Suivi
  trackingUrl?: string;
  currentPosition?: Position;
  estimatedTimeOfArrival?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  
  // Métadonnées
  metadata?: Metadata;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  livreurId?: string;
  customerId: string;
}

export interface DeliveryCreateInput {
  pickup: {
    address: Omit<Address, 'formatted'>;
    contact: ContactInfo;
    timeWindow: {
      start: Date | string;
      end: Date | string;
    };
    notes?: string;
  };
  dropoff: {
    address: Omit<Address, 'formatted'>;
    contact: ContactInfo;
    timeWindow: {
      start: Date | string;
      end: Date | string;
    };
    notes?: string;
  };
  items?: Omit<DeliveryItem, 'id'>[];
  priority?: 'low' | 'normal' | 'high';
  metadata?: Metadata;
}

export interface DeliveryUpdateInput {
  status?: DeliveryStatus;
  livreurId?: string | null;
  metadata?: Metadata;
}

export interface DeliveryFilterParams {
  status?: DeliveryStatus | DeliveryStatus[];
  livreurId?: string;
  customerId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  search?: string;
}
