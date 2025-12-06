export interface Position {
    lat: number;
    lng: number;
    timestamp?: Date;
    accuracy?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
}
export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}
export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    formatted: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
export interface TimeWindow {
    start: Date;
    end: Date;
}
export declare enum DeliveryStatus {
    PENDING = "pending",
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare enum LivreurStatus {
    OFFLINE = "offline",
    AVAILABLE = "available",
    BUSY = "busy",
    ON_BREAK = "on_break",
    OFFLINE_DUTY = "offline_duty"
}
export interface ContactInfo {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
}
export interface Metadata {
    [key: string]: any;
}
