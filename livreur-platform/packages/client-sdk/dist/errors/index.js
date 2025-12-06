"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceError = exports.RateLimitError = exports.ConflictError = exports.ValidationError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ApiError = void 0;
/**
 * Classe de base pour les erreurs de l'API
 */
class ApiError extends Error {
    constructor(message, status = 500, details = {}, code) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
        this.code = code;
        this.timestamp = new Date();
        // Maintient la chaîne de prototype correcte
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
    /**
     * Crée une erreur à partir d'une réponse d'erreur HTTP
     */
    static fromResponse(error) {
        if (error.response) {
            // Erreur de l'API avec réponse
            const { status, data } = error.response;
            const { message, code, details } = data.error || {};
            return new ApiError(message || 'Une erreur est survenue', status, details, code);
        }
        else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            return new ApiError('Aucune réponse du serveur. Vérifiez votre connexion Internet.', 0, {}, 'NETWORK_ERROR');
        }
        else {
            // Erreur lors de la configuration de la requête
            return new ApiError(error.message || 'Erreur lors de la configuration de la requête', 0, {}, 'REQUEST_ERROR');
        }
    }
    /**
     * Vérifie si l'erreur est une erreur de réseau
     */
    get isNetworkError() {
        return this.code === 'NETWORK_ERROR' || this.status === 0;
    }
    /**
     * Vérifie si l'erreur est une erreur d'authentification
     */
    get isAuthError() {
        return this.status === 401 || this.status === 403;
    }
    /**
     * Vérifie si l'erreur est une erreur de validation
     */
    get isValidationError() {
        return this.status === 422 || this.code === 'VALIDATION_ERROR';
    }
    /**
     * Convertit l'erreur en objet simple pour le sérialiser
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp.toISOString(),
            stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
        };
    }
}
exports.ApiError = ApiError;
/**
 * Erreur d'authentification (401)
 */
class UnauthorizedError extends ApiError {
    constructor(message = 'Non authentifié') {
        super(message, 401, {}, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * Erreur d'autorisation (403)
 */
class ForbiddenError extends ApiError {
    constructor(message = 'Accès refusé') {
        super(message, 403, {}, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * Erreur de ressource non trouvée (404)
 */
class NotFoundError extends ApiError {
    constructor(resource, id) {
        const message = id
            ? `${resource} avec l'ID ${id} non trouvé`
            : `${resource} non trouvé`;
        super(message, 404, { resource, id }, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Erreur de validation (422)
 */
class ValidationError extends ApiError {
    constructor(errors, message = 'Erreur de validation') {
        super(message, 422, { errors }, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
/**
 * Erreur de conflit (409)
 */
class ConflictError extends ApiError {
    constructor(message = 'Conflit de données') {
        super(message, 409, {}, 'CONFLICT');
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
/**
 * Erreur de limite de débit (429)
 */
class RateLimitError extends ApiError {
    constructor(retryAfter = 60, message = 'Trop de requêtes') {
        super(message, 429, { retryAfter }, 'RATE_LIMIT_EXCEEDED');
        this.name = 'RateLimitError';
        this.retryAfter = retryAfter;
    }
}
exports.RateLimitError = RateLimitError;
/**
 * Erreur de maintenance (503)
 */
class MaintenanceError extends ApiError {
    constructor(estimatedRestoreTime, message = 'Service en maintenance') {
        const details = {};
        if (estimatedRestoreTime) {
            const restoreTime = typeof estimatedRestoreTime === 'string'
                ? new Date(estimatedRestoreTime)
                : estimatedRestoreTime;
            details.estimatedRestoreTime = restoreTime;
        }
        super(message, 503, details, 'MAINTENANCE');
        this.name = 'MaintenanceError';
        if (estimatedRestoreTime) {
            this.estimatedRestoreTime = typeof estimatedRestoreTime === 'string'
                ? new Date(estimatedRestoreTime)
                : estimatedRestoreTime;
        }
    }
}
exports.MaintenanceError = MaintenanceError;
