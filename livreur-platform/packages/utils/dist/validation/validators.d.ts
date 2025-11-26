/**
 * Vérifie si une valeur est vide (null, undefined, chaîne vide, tableau vide, objet vide)
 * @param value - Valeur à vérifier
 * @returns true si la valeur est considérée comme vide
 */
export declare function isEmpty(value: any): boolean;
/**
 * Vérifie si une valeur est une adresse email valide
 * @param email - Adresse email à valider
 * @returns true si l'email est valide
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Vérifie si une valeur est un numéro de téléphone valide (format international simplifié)
 * @param phone - Numéro de téléphone à valider
 * @returns true si le numéro est valide
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Vérifie si une valeur est une URL valide
 * @param url - URL à valider
 * @param options - Options de validation
 * @returns true si l'URL est valide
 */
export declare function isValidUrl(url: string, options?: {
    protocols?: string[];
    requireProtocol?: boolean;
    requireValidProtocol?: boolean;
}): boolean;
/**
 * Vérifie si une valeur est une date valide
 * @param date - Date à valider (peut être une chaîne, un nombre ou un objet Date)
 * @returns true si la date est valide
 */
export declare function isValidDate(date: any): boolean;
/**
 * Vérifie si une valeur est un nombre
 * @param value - Valeur à vérifier
 * @returns true si la valeur est un nombre
 */
export declare function isNumeric(value: any): boolean;
/**
 * Vérifie si une valeur est un entier
 * @param value - Valeur à vérifier
 * @returns true si la valeur est un entier
 */
export declare function isInteger(value: any): boolean;
/**
 * Vérifie si une valeur est comprise dans une plage
 * @param value - Valeur à vérifier
 * @param min - Valeur minimale (incluse)
 * @param max - Valeur maximale (incluse)
 * @returns true si la valeur est dans la plage
 */
export declare function isInRange(value: number | string, min: number, max: number): boolean;
/**
 * Vérifie si une chaîne a une longueur comprise dans une plage
 * @param value - Chaîne à vérifier
 * @param min - Longueur minimale (incluse)
 * @param max - Longueur maximale (incluse)
 * @returns true si la longueur est dans la plage
 */
export declare function isLengthInRange(value: string | any[], min: number, max?: number): boolean;
/**
 * Vérifie si une valeur correspond à une expression régulière
 * @param value - Valeur à vérifier
 * @param pattern - Expression régulière ou chaîne de motif
 * @returns true si la valeur correspond au motif
 */
export declare function matchesPattern(value: string, pattern: string | RegExp): boolean;
/**
 * Vérifie si une valeur est incluse dans une liste de valeurs autorisées
 * @param value - Valeur à vérifier
 * @param allowedValues - Tableau de valeurs autorisées
 * @returns true si la valeur est dans la liste des valeurs autorisées
 */
export declare function isOneOf<T>(value: T, allowedValues: readonly T[]): boolean;
/**
 * Valide un numéro de sécurité sociale français (format simplifié)
 * @param ssn - Numéro de sécurité sociale à valider
 * @returns true si le numéro est valide
 */
export declare function isValidFrenchSSN(ssn: string): boolean;
/**
 * Valide un code postal français (5 chiffres)
 * @param zipCode - Code postal à valider
 * @returns true si le code postal est valide
 */
export declare function isValidFrenchZipCode(zipCode: string): boolean;
/**
 * Valide un numéro de TVA intracommunautaire (format simplifié)
 * @param vat - Numéro de TVA à valider
 * @returns true si le numéro de TVA est valide
 */
export declare function isValidVATNumber(vat: string): boolean;
/**
 * Valide un mot de passe selon des critères de complexité
 * @param password - Mot de passe à valider
 * @param options - Options de validation
 * @returns Un objet avec les détails de la validation
 */
export declare function validatePassword(password: string, options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}): {
    isValid: boolean;
    errors: string[];
    score: number;
};
