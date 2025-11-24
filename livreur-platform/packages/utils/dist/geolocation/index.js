"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.calculateTravelTime = calculateTravelTime;
exports.isValidPosition = isValidPosition;
exports.calculateMidpoint = calculateMidpoint;
/**
 * Rayon moyen de la Terre en kilomètres
 */
const EARTH_RADIUS_KM = 6371;
/**
 * Calcule la distance entre deux coordonnées géographiques en utilisant la formule de Haversine
 * @param from Position de départ
 * @param to Position d'arrivée
 * @returns Distance en kilomètres
 */
function calculateDistance(from, to) {
    const dLat = toRadians(to.lat - from.lat);
    const dLon = toRadians(to.lng - from.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}
/**
 * Convertit des degrés en radians
 * @param degrees Angle en degrés
 * @returns Angle en radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/**
 * Calcule le temps de trajet estimé en fonction de la distance et de la vitesse moyenne
 * @param distance Distance en kilomètres
 * @param averageSpeed Vitesse moyenne en km/h (par défaut 30 km/h en ville)
 * @returns Temps de trajet en minutes
 */
function calculateTravelTime(distance, averageSpeed = 30) {
    if (distance <= 0)
        return 0;
    if (averageSpeed <= 0) {
        throw new Error('La vitesse moyenne doit être supérieure à 0');
    }
    return (distance / averageSpeed) * 60; // Convertit en minutes
}
/**
 * Vérifie si une position est valide
 * @param position Position à vérifier
 * @returns true si la position est valide, false sinon
 */
function isValidPosition(position) {
    return (position.lat >= -90 &&
        position.lat <= 90 &&
        position.lng >= -180 &&
        position.lng <= 180);
}
/**
 * Calcule le point médian entre plusieurs positions
 * @param positions Tableau de positions
 * @returns Position médiane ou null si le tableau est vide
 */
function calculateMidpoint(positions) {
    if (positions.length === 0)
        return null;
    const sum = positions.reduce((acc, pos) => ({
        lat: acc.lat + pos.lat,
        lng: acc.lng + pos.lng,
    }), { lat: 0, lng: 0 });
    return {
        lat: sum.lat / positions.length,
        lng: sum.lng / positions.length,
    };
}
