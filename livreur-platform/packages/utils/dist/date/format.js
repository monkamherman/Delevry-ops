"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.timeAgo = timeAgo;
exports.formatDuration = formatDuration;
exports.isToday = isToday;
exports.isFutureDate = isFutureDate;
exports.isPastDate = isPastDate;
exports.calculateAge = calculateAge;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
/**
 * Formate une date selon un format spécifique
 * @param date - Date à formater (Date, string ou timestamp)
 * @param format - Format de date (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns La date formatée en chaîne de caractères
 */
function formatDate(date, format = 'dd/MM/yyyy HH:mm') {
    const parsedDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    if (!(0, date_fns_1.isValid)(parsedDate)) {
        throw new Error('Date invalide');
    }
    return (0, date_fns_1.format)(parsedDate, format, { locale: locale_1.fr });
}
/**
 * Calcule la différence de temps entre une date et maintenant en français
 * @param date - Date de référence (Date, string ou timestamp)
 * @returns Chaîne décrivant la différence (ex: "il y a 2 heures")
 */
function timeAgo(date) {
    const parsedDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    if (!(0, date_fns_1.isValid)(parsedDate)) {
        throw new Error('Date invalide');
    }
    return (0, date_fns_1.formatDistanceToNow)(parsedDate, {
        addSuffix: true,
        locale: locale_1.fr
    });
}
/**
 * Formate une durée en millisecondes en une chaîne lisible
 * @param ms - Durée en millisecondes
 * @returns Chaîne formatée (ex: "2h 30min 15s")
 */
function formatDuration(ms) {
    if (ms < 0)
        return '0s';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const parts = [];
    if (days > 0)
        parts.push(`${days}j`);
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(`${minutes}min`);
    if (seconds > 0 || parts.length === 0)
        parts.push(`${seconds}s`);
    return parts.join(' ');
}
/**
 * Vérifie si une date est aujourd'hui
 * @param date - Date à vérifier
 * @returns true si la date est aujourd'hui
 */
function isToday(date) {
    const today = new Date();
    const checkDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return (checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear());
}
/**
 * Vérifie si une date est dans le futur
 * @param date - Date à vérifier
 * @returns true si la date est dans le futur
 */
function isFutureDate(date) {
    const checkDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return checkDate > new Date();
}
/**
 * Vérifie si une date est dans le passé
 * @param date - Date à vérifier
 * @returns true si la date est dans le passé
 */
function isPastDate(date) {
    const checkDate = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return checkDate < new Date();
}
/**
 * Calcule l'âge à partir d'une date de naissance
 * @param birthDate - Date de naissance
 * @returns Âge en années
 */
function calculateAge(birthDate) {
    const birth = typeof birthDate === 'string' ? (0, date_fns_1.parseISO)(birthDate) : new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}
