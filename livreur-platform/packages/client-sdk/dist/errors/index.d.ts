/**
 * Classe de base pour les erreurs de l'API
 */
export declare class ApiError extends Error {
    status: number;
    code?: string;
    details?: any;
    timestamp: Date;
    constructor(message: string, status?: number, details?: any, code?: string);
    /**
     * Crée une erreur à partir d'une réponse d'erreur HTTP
     */
    static fromResponse(error: any): ApiError;
    /**
     * Vérifie si l'erreur est une erreur de réseau
     */
    get isNetworkError(): boolean;
    /**
     * Vérifie si l'erreur est une erreur d'authentification
     */
    get isAuthError(): boolean;
    /**
     * Vérifie si l'erreur est une erreur de validation
     */
    get isValidationError(): boolean;
    /**
     * Convertit l'erreur en objet simple pour le sérialiser
     */
    toJSON(): {
        name: string;
        message: string;
        status: number;
        code: string | undefined;
        details: any;
        timestamp: string;
        stack: string | undefined;
    };
}
/**
 * Erreur d'authentification (401)
 */
export declare class UnauthorizedError extends ApiError {
    constructor(message?: string);
}
/**
 * Erreur d'autorisation (403)
 */
export declare class ForbiddenError extends ApiError {
    constructor(message?: string);
}
/**
 * Erreur de ressource non trouvée (404)
 */
export declare class NotFoundError extends ApiError {
    constructor(resource: string, id?: string);
}
/**
 * Erreur de validation (422)
 */
export declare class ValidationError extends ApiError {
    errors: Record<string, string[]>;
    constructor(errors: Record<string, string[]>, message?: string);
}
/**
 * Erreur de conflit (409)
 */
export declare class ConflictError extends ApiError {
    constructor(message?: string);
}
/**
 * Erreur de limite de débit (429)
 */
export declare class RateLimitError extends ApiError {
    retryAfter: number;
    constructor(retryAfter?: number, message?: string);
}
/**
 * Erreur de maintenance (503)
 */
export declare class MaintenanceError extends ApiError {
    estimatedRestoreTime?: Date;
    constructor(estimatedRestoreTime?: Date | string, message?: string);
}
