"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyResponseSchema = exports.paginatedApiResponseSchema = exports.apiResponseSchema = exports.errorResponseWrapperSchema = exports.successResponseSchema = exports.paginatedResponseSchema = exports.errorResponseSchema = void 0;
const zod_1 = require("zod");
/**
 * Schéma de base pour une réponse d'erreur API
 */
exports.errorResponseSchema = zod_1.z.object({
    /**
     * Code d'erreur unique identifiant le type d'erreur
     * @example "VALIDATION_ERROR"
     */
    code: zod_1.z.string(),
    /**
     * Message d'erreur lisible par l'humain
     * @example "La validation a échoué"
     */
    message: zod_1.z.string(),
    /**
     * Détails supplémentaires sur l'erreur (optionnel)
     */
    details: zod_1.z.record(zod_1.z.any()).optional(),
    /**
     * Erreurs de validation (optionnel)
     */
    errors: zod_1.z.record(zod_1.z.array(zod_1.z.string())).optional(),
    /**
     * Horodatage de l'erreur
     * @example "2023-04-01T12:00:00Z"
     */
    timestamp: zod_1.z.string().datetime().optional(),
});
/**
 * Schéma pour une réponse paginée
 */
const paginatedResponseSchema = (itemSchema) => {
    return zod_1.z.object({
        /**
         * Tableau des éléments de la page courante
         */
        data: zod_1.z.array(itemSchema),
        /**
         * Métadonnées de pagination
         */
        meta: zod_1.z.object({
            /**
             * Numéro de la page courante (commence à 1)
             */
            currentPage: zod_1.z.number().int().positive(),
            /**
             * Nombre d'éléments par page
             */
            perPage: zod_1.z.number().int().positive(),
            /**
             * Nombre total d'éléments
             */
            total: zod_1.z.number().int().nonnegative(),
            /**
             * Nombre total de pages
             */
            totalPages: zod_1.z.number().int().positive(),
            /**
             * Lien vers la page suivante (si elle existe)
             */
            nextPage: zod_1.z.string().url().optional(),
            /**
             * Lien vers la page précédente (si elle existe)
             */
            prevPage: zod_1.z.string().url().optional(),
        }),
    });
};
exports.paginatedResponseSchema = paginatedResponseSchema;
/**
 * Schéma pour une réponse de succès générique
 */
const successResponseSchema = (dataSchema) => {
    return zod_1.z.object({
        /**
         * Indique si la requête a réussi
         */
        success: zod_1.z.literal(true),
        /**
         * Données de la réponse
         */
        data: dataSchema,
        /**
         * Métadonnées supplémentaires (optionnel)
         */
        meta: zod_1.z.record(zod_1.z.any()).optional(),
    });
};
exports.successResponseSchema = successResponseSchema;
/**
 * Schéma pour une réponse d'erreur générique
 */
exports.errorResponseWrapperSchema = zod_1.z.object({
    /**
     * Indique si la requête a échoué
     */
    success: zod_1.z.literal(false),
    /**
     * Détails de l'erreur
     */
    error: exports.errorResponseSchema,
});
/**
 * Schéma pour une réponse API générique
 */
const apiResponseSchema = (dataSchema) => {
    return zod_1.z.union([
        (0, exports.successResponseSchema)(dataSchema),
        exports.errorResponseWrapperSchema,
    ]);
};
exports.apiResponseSchema = apiResponseSchema;
/**
 * Schéma pour une réponse de liste paginée
 */
const paginatedApiResponseSchema = (itemSchema) => {
    return (0, exports.apiResponseSchema)((0, exports.paginatedResponseSchema)(itemSchema));
};
exports.paginatedApiResponseSchema = paginatedApiResponseSchema;
/**
 * Schéma pour une réponse vide (sans données)
 */
exports.emptyResponseSchema = (0, exports.apiResponseSchema)(zod_1.z.void());
