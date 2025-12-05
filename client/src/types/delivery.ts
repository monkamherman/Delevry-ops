export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Delivery {
  id: string;
  trackingNumber: string;
  status: 'En attente' | 'En cours' | 'Livré' | 'Annulé';
  deliveryAddress: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  location?: Location;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryStatusUpdate {
  deliveryId: string;
  status: 'En attente' | 'En cours' | 'Livré' | 'Annulé';
  updatedAt: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  notes?: string;
}

export interface DeliveryFilters {
  status?: ('En attente' | 'En cours' | 'Livré' | 'Annulé')[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchQuery?: string;
}
