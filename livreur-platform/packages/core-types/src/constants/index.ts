/**
 * Constantes liées à la pagination
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Constantes pour les limites de validation
 */
export const VALIDATION = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  ADDRESS_MAX_LENGTH: 500,
  VEHICLE_IDENTIFIER_MAX_LENGTH: 20,
  VEHICLE_TYPE_MAX_LENGTH: 50,
} as const;

/**
 * Constantes pour les erreurs courantes
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: `Le mot de passe doit contenir au moins ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`,
  INVALID_PHONE: 'Numéro de téléphone invalide',
  NOT_FOUND: 'Ressource non trouvée',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès refusé',
  INTERNAL_SERVER_ERROR: 'Erreur interne du serveur',
} as const;

/**
 * Formats de date utilisés dans l'application
 */
export const DATE_FORMATS = {
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  DISPLAY_DATE: 'dd/MM/yyyy',
  DISPLAY_DATETIME: 'dd/MM/yyyy HH:mm',
} as const;