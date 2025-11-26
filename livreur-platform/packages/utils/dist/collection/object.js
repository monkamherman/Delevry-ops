"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.cleanObject = cleanObject;
exports.isEmptyObject = isEmptyObject;
exports.getValue = getValue;
exports.setValue = setValue;
exports.pick = pick;
exports.omit = omit;
exports.transformKeys = transformKeys;
exports.transformValues = transformValues;
/**
 * Effectue une copie profonde d'un objet ou d'un tableau
 * @param source - Objet ou tableau à copier
 * @returns Copie profonde de l'objet
 */
function deepClone(source) {
    if (source === null || typeof source !== 'object') {
        return source;
    }
    if (Array.isArray(source)) {
        return source.map(item => deepClone(item));
    }
    if (source instanceof Date) {
        return new Date(source.getTime());
    }
    if (source instanceof Map) {
        const result = new Map();
        source.forEach((value, key) => {
            result.set(key, deepClone(value));
        });
        return result;
    }
    if (source instanceof Set) {
        const result = new Set();
        source.forEach(value => {
            result.add(deepClone(value));
        });
        return result;
    }
    const result = {};
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            result[key] = deepClone(source[key]);
        }
    }
    return result;
}
/**
 * Fusionne deux objets en profondeur
 * @param target - Objet cible
 * @param source - Objet source à fusionner
 * @returns Objet fusionné
 */
function deepMerge(target, source) {
    const result = { ...deepClone(target) };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const targetValue = result[key];
            const sourceValue = source[key];
            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                result[key] = [...targetValue, ...sourceValue];
            }
            else if (targetValue &&
                sourceValue &&
                typeof targetValue === 'object' &&
                typeof sourceValue === 'object' &&
                !(targetValue instanceof Date) &&
                !(sourceValue instanceof Date)) {
                result[key] = deepMerge(targetValue, sourceValue);
            }
            else {
                result[key] = sourceValue;
            }
        }
    }
    return result;
}
/**
 * Supprime les propriétés avec des valeurs null ou undefined d'un objet
 * @param obj - Objet à nettoyer
 * @param options - Options de nettoyage
 * @returns Nouvel objet sans les propriétés null/undefined
 */
function cleanObject(obj, options = {}) {
    const { removeEmptyStrings = true, removeZeros = false, removeFalse = false } = options;
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value === null || value === undefined) {
            return acc;
        }
        if (removeEmptyStrings && value === '') {
            return acc;
        }
        if (removeZeros && value === 0) {
            return acc;
        }
        if (removeFalse && value === false) {
            return acc;
        }
        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            const cleaned = cleanObject(value, options);
            if (Object.keys(cleaned).length > 0) {
                acc[key] = cleaned;
            }
        }
        else {
            acc[key] = value;
        }
        return acc;
    }, {});
}
/**
 * Vérifie si un objet est vide (n'a pas de propriétés propres énumérables)
 * @param obj - Objet à vérifier
 * @returns true si l'objet est vide
 */
function isEmptyObject(obj) {
    if (obj === null || obj === undefined)
        return true;
    if (typeof obj !== 'object')
        return false;
    if (Object.getOwnPropertySymbols(obj).length > 0)
        return false;
    return Object.keys(obj).length === 0;
}
/**
 * Récupère une valeur d'un objet en utilisant un chemin
 * @param obj - Objet source
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param defaultValue - Valeur par défaut si la propriété n'existe pas
 * @returns La valeur trouvée ou la valeur par défaut
 */
function getValue(obj, path, defaultValue) {
    if (!obj || typeof obj !== 'object')
        return defaultValue;
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined)
            return defaultValue;
        result = result[key];
    }
    return result !== undefined ? result : defaultValue;
}
/**
 * Définit une valeur dans un objet en utilisant un chemin
 * @param obj - Objet cible
 * @param path - Chemin vers la propriété (ex: 'user.address.city' ou ['user', 'address', 'city'])
 * @param value - Valeur à définir
 * @returns Nouvel objet avec la valeur définie
 */
function setValue(obj, path, value) {
    if (!obj || typeof obj !== 'object') {
        throw new Error('La cible doit être un objet');
    }
    const keys = Array.isArray(path) ? [...path] : path.split('.');
    const result = deepClone(obj);
    let current = result;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
            current[key] = value;
        }
        else {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
    }
    return result;
}
/**
 * Crée un nouvel objet avec uniquement les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à inclure
 * @returns Nouvel objet avec uniquement les propriétés spécifiées
 */
function pick(obj, keys) {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}
/**
 * Crée un nouvel objet sans les propriétés spécifiées
 * @param obj - Objet source
 * @param keys - Tableau de clés à exclure
 * @returns Nouvel objet sans les propriétés spécifiées
 */
function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
/**
 * Transforme les clés d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des clés
 * @returns Nouvel objet avec les clés transformées
 */
function transformKeys(obj, transformFn) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        const newKey = transformFn(key);
        result[newKey] = value;
        return result;
    }, {});
}
/**
 * Transforme les valeurs d'un objet selon une fonction de transformation
 * @param obj - Objet source
 * @param transformFn - Fonction de transformation des valeurs
 * @returns Nouvel objet avec les valeurs transformées
 */
function transformValues(obj, transformFn) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        result[key] = transformFn(value, key);
        return result;
    }, {});
}
