"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_FORMATS = exports.ERROR_MESSAGES = exports.VALIDATION = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = void 0;
/**
 * Constantes liées à la pagination
 */
exports.DEFAULT_PAGE_SIZE = 10;
exports.MAX_PAGE_SIZE = 100;
/**
 * Constantes pour les limites de validation
 */
exports.VALIDATION = {
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MIN_LENGTH: 8,
    PHONE_MAX_LENGTH: 20,
    NAME_MAX_LENGTH: 100,
    ADDRESS_MAX_LENGTH: 500,
    VEHICLE_IDENTIFIER_MAX_LENGTH: 20,
    VEHICLE_TYPE_MAX_LENGTH: 50,
};
/**
 * Constantes pour les erreurs courantes
 */
exports.ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Ce champ est requis',
    INVALID_EMAIL: 'Adresse email invalide',
    PASSWORD_TOO_SHORT: `Le mot de passe doit contenir au moins ${exports.VALIDATION.PASSWORD_MIN_LENGTH} caractères`,
    INVALID_PHONE: 'Numéro de téléphone invalide',
    NOT_FOUND: 'Ressource non trouvée',
    UNAUTHORIZED: 'Non autorisé',
    FORBIDDEN: 'Accès refusé',
    INTERNAL_SERVER_ERROR: 'Erreur interne du serveur',
};
/**
 * Formats de date utilisés dans l'application
 */
exports.DATE_FORMATS = {
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    DISPLAY_DATE: 'dd/MM/yyyy',
    DISPLAY_DATETIME: 'dd/MM/yyyy HH:mm',
};
