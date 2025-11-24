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
    return (typeof pos.latitude === 'number' &&
        typeof pos.longitude === 'number' &&
        (pos.accuracy === undefined || typeof pos.accuracy === 'number') &&
        (pos.altitude === undefined || pos.altitude === null || typeof pos.altitude === 'number') &&
        (pos.speed === undefined || pos.speed === null || typeof pos.speed === 'number') &&
        (pos.heading === undefined || pos.heading === null || typeof pos.heading === 'number') &&
        typeof pos.timestamp === 'string' &&
        !isNaN(new Date(pos.timestamp).getTime()));
}
