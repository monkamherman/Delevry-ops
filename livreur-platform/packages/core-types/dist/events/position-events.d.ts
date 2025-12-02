import { Position } from '../models/position';
export declare enum PositionEventType {
    POSITION_UPDATE = "position_update",
    POSITION_HISTORY = "position_history",
    GEOLOCATION_ERROR = "geolocation_error"
}
export interface PositionUpdateEvent {
    type: PositionEventType.POSITION_UPDATE;
    payload: {
        livreurId: string;
        position: Position;
        speed?: number;
        heading?: number;
        accuracy?: number;
    };
}
export interface PositionHistoryEvent {
    type: PositionEventType.POSITION_HISTORY;
    payload: {
        livreurId: string;
        positions: Array<Position & {
            timestamp: string;
        }>;
        startTime: string;
        endTime: string;
    };
}
export interface GeolocationErrorEvent {
    type: PositionEventType.GEOLOCATION_ERROR;
    payload: {
        livreurId: string;
        error: {
            code: number;
            message: string;
        };
        timestamp: string;
    };
}
export type PositionEvent = PositionUpdateEvent | PositionHistoryEvent | GeolocationErrorEvent;
