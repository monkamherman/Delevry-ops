/**
 * Formate une date en chaîne de caractères lisible
 * @param date Date à formater (Date, chaîne ou timestamp)
 * @param formatString Format de sortie (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns Date formatée
 */
export declare function formatDate(date: Date | string | number, formatString?: string): string;
/**
 * Formate une durée en minutes en une chaîne lisible (ex: "2h 30min")
 * @param minutes Durée en minutes
 * @returns Durée formatée
 */
export declare function formatDuration(minutes: number): string;
/**
 * Formate une date en une chaîne relative (ex: "il y a 5 minutes", "hier", etc.)
 * @param date Date à formater
 * @returns Date relative formatée
 */
export declare function formatRelativeDate(date: Date | string | number): string;
/**
 * Calcule la différence entre deux dates en minutes
 * @param startDate Date de début
 * @param endDate Date de fin (par défaut: maintenant)
 * @returns Différence en minutes
 */
export declare function getTimeDifferenceInMinutes(startDate: Date | string | number, endDate?: Date | string | number): number;
/**
 * Formate une plage horaire
 * @param startDate Date de début
 * @param endDate Date de fin
 * @returns Plage horaire formatée (ex: "14:00 - 15:30")
 */
export declare function formatTimeRange(startDate: Date | string | number, endDate: Date | string | number): string;
/**
 * Vérifie si une date est dans le futur
 * @param date Date à vérifier
 * @returns true si la date est dans le futur, false sinon
 */
export declare function isFutureDate(date: Date | string | number): boolean;
/**
 * Vérifie si une date est dans le passé
 * @param date Date à vérifier
 * @returns true si la date est dans le passé, false sinon
 */
export declare function isPastDate(date: Date | string | number): boolean;
