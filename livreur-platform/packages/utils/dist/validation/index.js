"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionSchema = void 0;
exports.validatePosition = validatePosition;
exports.isValidEmail = isValidEmail;
exports.isValidFrenchPhoneNumber = isValidFrenchPhoneNumber;
exports.isValidFrenchZipCode = isValidFrenchZipCode;
exports.validatePassword = validatePassword;
exports.isValidSIRET = isValidSIRET;
const zod_1 = require("zod");
/**
 * Schéma de validation pour une position géographique
 */
exports.positionSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90, 'La latitude doit être comprise entre -90 et 90 degrés'),
    lng: zod_1.z.number().min(-180).max(180, 'La longitude doit être comprise entre -180 et 180 degrés'),
    timestamp: zod_1.z.date().optional(),
    accuracy: zod_1.z.number().min(0).optional(),
});
/**
 * Valide un objet de type Position
 * @param position Position à valider
 * @returns Un objet avec un booléen 'valid' et un tableau d'erreurs éventuelles
 */
function validatePosition(position) {
    const result = exports.positionSchema.safeParse(position);
    if (!result.success) {
        return {
            valid: false,
            errors: result.error.issues.map(issue => issue.message || 'Erreur de validation'),
        };
    }
    return { valid: true };
}
/**
 * Valide une adresse email
 * @param email Email à valider
 * @returns true si l'email est valide, false sinon
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Valide un numéro de téléphone français
 * @param phone Numéro de téléphone à valider
 * @returns true si le numéro est valide, false sinon
 */
function isValidFrenchPhoneNumber(phone) {
    // Format: 06 12 34 56 78 ou +33612345678 ou 0612345678
    const phoneRegex = /^(\+33|0)[67]([-. ]?[0-9]{2}){4}$/;
    return phoneRegex.test(phone);
}
/**
 * Valide un code postal français
 * @param zipCode Code postal à valider
 * @returns true si le code postal est valide, false sinon
 */
function isValidFrenchZipCode(zipCode) {
    // Format: 5 chiffres, commençant par 0-9
    const zipCodeRegex = /^[0-9]{5}$/;
    return zipCodeRegex.test(zipCode);
}
/**
 * Valide un mot de passe selon une politique de sécurité
 * @param password Mot de passe à valider
 * @returns Un objet avec un booléen 'valid' et un tableau d'exigences non satisfaites
 */
function validatePassword(password) {
    const requirements = [
        { test: (p) => p.length >= 8, message: 'Au moins 8 caractères' },
        { test: (p) => /[A-Z]/.test(p), message: 'Au moins une majuscule' },
        { test: (p) => /[a-z]/.test(p), message: 'Au moins une minuscule' },
        { test: (p) => /[0-9]/.test(p), message: 'Au moins un chiffre' },
        { test: (p) => /[^A-Za-z0-9]/.test(p), message: 'Au moins un caractère spécial' },
    ];
    const failedRequirements = requirements
        .filter(req => !req.test(password))
        .map(req => req.message);
    return {
        valid: failedRequirements.length === 0,
        requirements: failedRequirements,
    };
}
/**
 * Valide un numéro SIRET
 * @param siret Numéro SIRET à valider
 * @returns true si le numéro SIRET est valide, false sinon
 */
function isValidSIRET(siret) {
    // Supprimer les espaces et les tirets
    const cleanSiret = siret.replace(/[\s-]/g, '');
    // Vérifier la longueur (14 chiffres)
    if (!/^\d{14}$/.test(cleanSiret)) {
        return false;
    }
    // Algorithme de Luhn
    let sum = 0;
    let double = false;
    for (let i = cleanSiret.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanSiret.charAt(i), 10);
        if (double) {
            digit *= 2;
            if (digit > 9) {
                digit = (digit % 10) + 1;
            }
        }
        sum += digit;
        double = !double;
    }
    return sum % 10 === 0;
}
