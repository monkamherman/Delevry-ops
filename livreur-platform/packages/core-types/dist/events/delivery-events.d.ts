import { Position } from '../models/position';
export declare enum DeliveryEventType {
    DELIVERY_CREATED = "delivery_created",
    DELIVERY_UPDATED = "delivery_updated",
    DELIVERY_ASSIGNED = "delivery_assigned",
    DELIVERY_STATUS_CHANGED = "delivery_status_changed",
    DELIVERY_COMPLETED = "delivery_completed",
    DELIVERY_CANCELLED = "delivery_cancelled",
    DELIVERY_PROBLEM = "delivery_problem",
    PROOF_OF_DELIVERY = "proof_of_delivery"
}
export interface DeliveryBaseEvent {
    deliveryId: string;
    timestamp: string;
    userId?: string;
    livreurId?: string;
}
export interface DeliveryCreatedEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_CREATED;
    payload: {
        pickupAddress: string;
        deliveryAddress: string;
        estimatedPickupTime: string;
        estimatedDeliveryTime: string;
        customerName: string;
        customerPhone: string;
        items: Array<{
            id: string;
            description: string;
            quantity: number;
            weight?: number;
            dimensions?: {
                length: number;
                width: number;
                height: number;
            };
        }>;
    };
}
export interface DeliveryUpdatedEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_UPDATED;
    payload: {
        changes: {
            pickupAddress?: string;
            deliveryAddress?: string;
            estimatedPickupTime?: string;
            estimatedDeliveryTime?: string;
            customerName?: string;
            customerPhone?: string;
            notes?: string;
        };
    };
}
export interface DeliveryAssignedEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_ASSIGNED;
    payload: {
        assignedTo: string;
        assignedByName: string;
        assignedAt: string;
    };
}
export interface DeliveryStatusChangedEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_STATUS_CHANGED;
    payload: {
        previousStatus: string;
        newStatus: string;
        reason?: string;
        updatedAt: string;
    };
}
export interface DeliveryCompletedEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_COMPLETED;
    payload: {
        completedAt: string;
        signatureUrl?: string;
        notes?: string;
        rating?: number;
    };
}
export interface DeliveryCancelledEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_CANCELLED;
    payload: {
        reason: string;
        cancelledBy: string;
        cancelledAt: string;
        refundAmount?: number;
        refundReason?: string;
    };
}
export interface DeliveryProblemEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.DELIVERY_PROBLEM;
    payload: {
        issueType: 'delay' | 'damage' | 'missing' | 'other';
        description: string;
        reportedAt: string;
        reportedBy: string;
        requiresAction: boolean;
        actionTaken?: string;
    };
}
export interface ProofOfDeliveryEvent extends DeliveryBaseEvent {
    type: DeliveryEventType.PROOF_OF_DELIVERY;
    payload: {
        proofType: 'signature' | 'photo' | 'code';
        proofUrl?: string;
        signatureData?: string;
        verificationCode?: string;
        verifiedAt: string;
        verifiedBy?: string;
        location?: Position;
    };
}
export type DeliveryEvent = DeliveryCreatedEvent | DeliveryUpdatedEvent | DeliveryAssignedEvent | DeliveryStatusChangedEvent | DeliveryCompletedEvent | DeliveryCancelledEvent | DeliveryProblemEvent | ProofOfDeliveryEvent;
