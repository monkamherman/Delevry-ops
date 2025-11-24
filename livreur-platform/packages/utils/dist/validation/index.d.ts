import { z } from 'zod';
/**
 * Schéma de validation pour une position géographique
 */
export declare const positionSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
    timestamp: z.ZodOptional<z.ZodDate>;
    accuracy: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    lat: number;
    lng: number;
    accuracy?: number | undefined;
    timestamp?: Date | undefined;
}, {
    lat: number;
    lng: number;
    accuracy?: number | undefined;
    timestamp?: Date | undefined;
}>;
/**
 * Valide un objet de type Position
 * @param position Position à valider
 * @returns Un objet avec un booléen 'valid' et un tableau d'erreurs éventuelles
 */
export declare function validatePosition(position: unknown): {
    valid: boolean;
    errors?: string[];
};
/**
 * Valide une adresse email
 * @param email Email à valider
 * @returns true si l'email est valide, false sinon
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Valide un numéro de téléphone français
 * @param phone Numéro de téléphone à valider
 * @returns true si le numéro est valide, false sinon
 */
export declare function isValidFrenchPhoneNumber(phone: string): boolean;
/**
 * Valide un code postal français
 * @param zipCode Code postal à valider
 * @returns true si le code postal est valide, false sinon
 */
export declare function isValidFrenchZipCode(zipCode: string): boolean;
/**
 * Valide un mot de passe selon une politique de sécurité
 * @param password Mot de passe à valider
 * @returns Un objet avec un booléen 'valid' et un tableau d'exigences non satisfaites
 */
export declare function validatePassword(password: string): {
    valid: boolean;
    requirements: string[];
};
/**
 * Valide un numéro SIRET
 * @param siret Numéro SIRET à valider
 * @returns true si le numéro SIRET est valide, false sinon
 */
export declare function isValidSIRET(siret: string): boolean;
