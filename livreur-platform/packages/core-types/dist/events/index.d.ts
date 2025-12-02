export * from './position-events';
export * from './delivery-events';
export * from './livreur-events';
export * from '../models/position';
export * from '../models/livreur';
export interface BaseEvent<T = unknown> {
    type: string;
    payload: T;
    timestamp: string;
    emitterId: string;
}
export interface EventHandler<T = unknown> {
    (event: T): void | Promise<void>;
}
export declare enum EventChannel {
    POSITION_UPDATES = "position_updates",
    DELIVERY_UPDATES = "delivery_updates",
    SYSTEM_ALERTS = "system_alerts",
    ADMIN_UPDATES = "admin_updates"
}
export type { PositionUpdateEvent, PositionHistoryEvent, GeolocationErrorEvent, PositionEvent } from './position-events';
export type { DeliveryBaseEvent, DeliveryCreatedEvent, DeliveryUpdatedEvent, DeliveryAssignedEvent, DeliveryStatusChangedEvent, DeliveryCompletedEvent, DeliveryCancelledEvent, DeliveryProblemEvent, ProofOfDeliveryEvent, DeliveryEvent } from './delivery-events';
export type { LivreurBaseEvent, LivreurStatusChangedEvent, LivreurLocationUpdateEvent, LivreurAssignedEvent, LivreurAvailableEvent, LivreurOfflineEvent, LivreurShiftStartedEvent, LivreurShiftEndedEvent, LivreurAlertEvent, LivreurEvent, LivreurAlertType } from './livreur-events';
