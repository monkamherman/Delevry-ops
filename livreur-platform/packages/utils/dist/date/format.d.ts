/**
 * Formate une date selon un format spécifique
 * @param date - Date à formater (Date, string ou timestamp)
 * @param format - Format de date (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns La date formatée en chaîne de caractères
 */
export declare function formatDate(date: Date | string | number, format?: string): string;
/**
 * Calcule la différence de temps entre une date et maintenant en français
 * @param date - Date de référence (Date, string ou timestamp)
 * @returns Chaîne décrivant la différence (ex: "il y a 2 heures")
 */
export declare function timeAgo(date: Date | string | number): string;
/**
 * Formate une durée en millisecondes en une chaîne lisible
 * @param ms - Durée en millisecondes
 * @returns Chaîne formatée (ex: "2h 30min 15s")
 */
export declare function formatDuration(ms: number): string;
/**
 * Vérifie si une date est aujourd'hui
 * @param date - Date à vérifier
 * @returns true si la date est aujourd'hui
 */
export declare function isToday(date: Date | string | number): boolean;
/**
 * Vérifie si une date est dans le futur
 * @param date - Date à vérifier
 * @returns true si la date est dans le futur
 */
export declare function isFutureDate(date: Date | string | number): boolean;
/**
 * Vérifie si une date est dans le passé
 * @param date - Date à vérifier
 * @returns true si la date est dans le passé
 */
export declare function isPastDate(date: Date | string | number): boolean;
/**
 * Calcule l'âge à partir d'une date de naissance
 * @param birthDate - Date de naissance
 * @returns Âge en années
 */
export declare function calculateAge(birthDate: Date | string | number): number;
