"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.formatDuration = formatDuration;
exports.formatRelativeDate = formatRelativeDate;
exports.getTimeDifferenceInMinutes = getTimeDifferenceInMinutes;
exports.formatTimeRange = formatTimeRange;
exports.isFutureDate = isFutureDate;
exports.isPastDate = isPastDate;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
/**
 * Formate une date en chaîne de caractères lisible
 * @param date Date à formater (Date, chaîne ou timestamp)
 * @param formatString Format de sortie (par défaut: 'dd/MM/yyyy HH:mm')
 * @returns Date formatée
 */
function formatDate(date, formatString = 'dd/MM/yyyy HH:mm') {
    const dateObj = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return (0, date_fns_1.format)(dateObj, formatString, { locale: locale_1.fr });
}
/**
 * Formate une durée en minutes en une chaîne lisible (ex: "2h 30min")
 * @param minutes Durée en minutes
 * @returns Durée formatée
 */
function formatDuration(minutes) {
    if (minutes < 0)
        return '0 min';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (hours === 0)
        return `${remainingMinutes} min`;
    if (remainingMinutes === 0)
        return `${hours}h`;
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}min`;
}
/**
 * Formate une date en une chaîne relative (ex: "il y a 5 minutes", "hier", etc.)
 * @param date Date à formater
 * @returns Date relative formatée
 */
function formatRelativeDate(date) {
    const dateObj = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    if ((0, date_fns_1.isToday)(dateObj)) {
        return `Aujourd'hui à ${(0, date_fns_1.format)(dateObj, 'HH:mm')}`;
    }
    if ((0, date_fns_1.isYesterday)(dateObj)) {
        return `Hier à ${(0, date_fns_1.format)(dateObj, 'HH:mm')}`;
    }
    return (0, date_fns_1.formatDistanceToNow)(dateObj, {
        addSuffix: true,
        locale: locale_1.fr
    });
}
/**
 * Calcule la différence entre deux dates en minutes
 * @param startDate Date de début
 * @param endDate Date de fin (par défaut: maintenant)
 * @returns Différence en minutes
 */
function getTimeDifferenceInMinutes(startDate, endDate = new Date()) {
    const start = typeof startDate === 'string' ? (0, date_fns_1.parseISO)(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? (0, date_fns_1.parseISO)(endDate) : new Date(endDate);
    return (0, date_fns_1.differenceInMinutes)(end, start);
}
/**
 * Formate une plage horaire
 * @param startDate Date de début
 * @param endDate Date de fin
 * @returns Plage horaire formatée (ex: "14:00 - 15:30")
 */
function formatTimeRange(startDate, endDate) {
    const start = typeof startDate === 'string' ? (0, date_fns_1.parseISO)(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? (0, date_fns_1.parseISO)(endDate) : new Date(endDate);
    const startTime = (0, date_fns_1.format)(start, 'HH:mm');
    const endTime = (0, date_fns_1.format)(end, 'HH:mm');
    return `${startTime} - ${endTime}`;
}
/**
 * Vérifie si une date est dans le futur
 * @param date Date à vérifier
 * @returns true si la date est dans le futur, false sinon
 */
function isFutureDate(date) {
    const dateObj = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return dateObj > new Date();
}
/**
 * Vérifie si une date est dans le passé
 * @param date Date à vérifier
 * @returns true si la date est dans le passé, false sinon
 */
function isPastDate(date) {
    const dateObj = typeof date === 'string' ? (0, date_fns_1.parseISO)(date) : new Date(date);
    return dateObj < new Date();
}
