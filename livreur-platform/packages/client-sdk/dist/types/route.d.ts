import { Position } from './common';
export interface RouteStep {
    distance: number;
    duration: number;
    instruction: string;
    name: string;
    type: string;
    modifier?: string;
    way_points: [number, number];
}
export interface Route {
    id: string;
    name?: string;
    waypoints: Position[];
    polyline: string;
    distance: number;
    duration: number;
    steps?: RouteStep[];
    metadata?: {
        [key: string]: any;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface RouteOptimizationParams {
    waypoints: Array<{
        id: string;
        position: Position;
        type: 'pickup' | 'delivery' | 'break' | 'other';
        duration?: number;
        timeWindows?: Array<{
            start: Date | string;
            end: Date | string;
        }>;
        priority?: number;
    }>;
    constraints?: {
        maxTravelTime?: number;
        maxDistance?: number;
        maxStops?: number;
        maxWaitTime?: number;
    };
    options?: {
        roundTrip?: boolean;
        avoidTolls?: boolean;
        avoidHighways?: boolean;
        avoidFerries?: boolean;
        departureTime?: Date | string;
        traffic?: 'enabled' | 'disabled';
    };
    metadata?: {
        [key: string]: any;
    };
}
export interface RouteOptimizationResult {
    route: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>;
    statistics: {
        totalDistance: number;
        totalDuration: number;
        totalStops: number;
        totalWaitTime: number;
        totalServiceTime: number;
        totalTravelTime: number;
    };
    violations: Array<{
        type: string;
        description: string;
        stopId?: string;
        actualValue: number;
        maxAllowedValue?: number;
    }>;
    metadata?: {
        [key: string]: any;
    };
}
