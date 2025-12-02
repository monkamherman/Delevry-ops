"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPosition = isValidPosition;
/**
 * Vérifie si un objet est une position valide
 */
function isValidPosition(position) {
    if (typeof position !== 'object' || position === null)
        return false;
    const pos = position;
    // Vérification des types de base
    if (typeof pos.latitude !== 'number' ||
        typeof pos.longitude !== 'number' ||
        (pos.accuracy !== undefined && typeof pos.accuracy !== 'number') ||
        (pos.altitude !== undefined && pos.altitude !== null && typeof pos.altitude !== 'number') ||
        (pos.speed !== undefined && pos.speed !== null && typeof pos.speed !== 'number') ||
        (pos.heading !== undefined && pos.heading !== null && typeof pos.heading !== 'number') ||
        typeof pos.timestamp !== 'string' ||
        isNaN(new Date(pos.timestamp).getTime())) {
        return false;
    }
    // Validation des plages de latitude et longitude
    if (pos.latitude < -90 || pos.latitude > 90)
        return false;
    if (pos.longitude < -180 || pos.longitude > 180)
        return false;
    // Validation de la précision (doit être positive si définie)
    if (pos.accuracy !== undefined && pos.accuracy < 0)
        return false;
    // Validation de la vitesse (doit être positive si définie)
    if (pos.speed !== undefined && pos.speed !== null && pos.speed < 0)
        return false;
    // Validation du cap (doit être entre 0 et 360 si défini)
    if (pos.heading !== undefined && pos.heading !== null && (pos.heading < 0 || pos.heading > 360)) {
        return false;
    }
    return true;
}
