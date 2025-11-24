/**
 * Constantes liées à la pagination
 */
export declare const DEFAULT_PAGE_SIZE = 10;
export declare const MAX_PAGE_SIZE = 100;
/**
 * Constantes pour les limites de validation
 */
export declare const VALIDATION: {
    readonly EMAIL_MAX_LENGTH: 255;
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PHONE_MAX_LENGTH: 20;
    readonly NAME_MAX_LENGTH: 100;
    readonly ADDRESS_MAX_LENGTH: 500;
    readonly VEHICLE_IDENTIFIER_MAX_LENGTH: 20;
    readonly VEHICLE_TYPE_MAX_LENGTH: 50;
};
/**
 * Constantes pour les erreurs courantes
 */
export declare const ERROR_MESSAGES: {
    readonly REQUIRED_FIELD: "Ce champ est requis";
    readonly INVALID_EMAIL: "Adresse email invalide";
    readonly PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères";
    readonly INVALID_PHONE: "Numéro de téléphone invalide";
    readonly NOT_FOUND: "Ressource non trouvée";
    readonly UNAUTHORIZED: "Non autorisé";
    readonly FORBIDDEN: "Accès refusé";
    readonly INTERNAL_SERVER_ERROR: "Erreur interne du serveur";
};
/**
 * Formats de date utilisés dans l'application
 */
export declare const DATE_FORMATS: {
    readonly ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    readonly DISPLAY_DATE: "dd/MM/yyyy";
    readonly DISPLAY_DATETIME: "dd/MM/yyyy HH:mm";
};
