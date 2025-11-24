export { LivreurStatus } from '../models/livreur';
export declare enum DeliveryStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED"
}
export declare enum VehicleType {
    BIKE = "BIKE",
    SCOOTER = "SCOOTER",
    CAR = "CAR",
    VAN = "VAN",
    WALKING = "WALKING"
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    DELIVERY_PERSON = "DELIVERY_PERSON",
    CUSTOMER = "CUSTOMER"
}
