import { DeliveryStatus, TimeWindow, Address, ContactInfo, Position, Metadata } from './common';
export interface DeliveryItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    barcode?: string;
    metadata?: Metadata;
}
export interface Delivery {
    id: string;
    reference: string;
    status: DeliveryStatus;
    priority: 'low' | 'normal' | 'high';
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
    items?: DeliveryItem[];
    totalWeight?: number;
    totalVolume?: number;
    trackingUrl?: string;
    currentPosition?: Position;
    estimatedTimeOfArrival?: Date;
    actualPickupTime?: Date;
    actualDeliveryTime?: Date;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
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
