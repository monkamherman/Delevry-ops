export * from './common';
export * from './delivery';
export * from './livreur';
export * from './route';
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ListParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}
