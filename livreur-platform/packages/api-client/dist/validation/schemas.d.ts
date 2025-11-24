import { z } from 'zod';
/**
 * Schéma de base pour une réponse d'erreur API
 */
export declare const errorResponseSchema: z.ZodObject<{
    /**
     * Code d'erreur unique identifiant le type d'erreur
     * @example "VALIDATION_ERROR"
     */
    code: z.ZodString;
    /**
     * Message d'erreur lisible par l'humain
     * @example "La validation a échoué"
     */
    message: z.ZodString;
    /**
     * Détails supplémentaires sur l'erreur (optionnel)
     */
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    /**
     * Erreurs de validation (optionnel)
     */
    errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
    /**
     * Horodatage de l'erreur
     * @example "2023-04-01T12:00:00Z"
     */
    timestamp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    details?: Record<string, any> | undefined;
    errors?: Record<string, string[]> | undefined;
    timestamp?: string | undefined;
}, {
    code: string;
    message: string;
    details?: Record<string, any> | undefined;
    errors?: Record<string, string[]> | undefined;
    timestamp?: string | undefined;
}>;
/**
 * Schéma pour une réponse paginée
 */
export declare const paginatedResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    /**
     * Tableau des éléments de la page courante
     */
    data: z.ZodArray<T, "many">;
    /**
     * Métadonnées de pagination
     */
    meta: z.ZodObject<{
        /**
         * Numéro de la page courante (commence à 1)
         */
        currentPage: z.ZodNumber;
        /**
         * Nombre d'éléments par page
         */
        perPage: z.ZodNumber;
        /**
         * Nombre total d'éléments
         */
        total: z.ZodNumber;
        /**
         * Nombre total de pages
         */
        totalPages: z.ZodNumber;
        /**
         * Lien vers la page suivante (si elle existe)
         */
        nextPage: z.ZodOptional<z.ZodString>;
        /**
         * Lien vers la page précédente (si elle existe)
         */
        prevPage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        nextPage?: string | undefined;
        prevPage?: string | undefined;
    }, {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        nextPage?: string | undefined;
        prevPage?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: T["_output"][];
    meta: {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        nextPage?: string | undefined;
        prevPage?: string | undefined;
    };
}, {
    data: T["_input"][];
    meta: {
        currentPage: number;
        perPage: number;
        total: number;
        totalPages: number;
        nextPage?: string | undefined;
        prevPage?: string | undefined;
    };
}>;
/**
 * Schéma pour une réponse de succès générique
 */
export declare const successResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
/**
 * Schéma pour une réponse d'erreur générique
 */
export declare const errorResponseWrapperSchema: z.ZodObject<{
    /**
     * Indique si la requête a échoué
     */
    success: z.ZodLiteral<false>;
    /**
     * Détails de l'erreur
     */
    error: z.ZodObject<{
        /**
         * Code d'erreur unique identifiant le type d'erreur
         * @example "VALIDATION_ERROR"
         */
        code: z.ZodString;
        /**
         * Message d'erreur lisible par l'humain
         * @example "La validation a échoué"
         */
        message: z.ZodString;
        /**
         * Détails supplémentaires sur l'erreur (optionnel)
         */
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        /**
         * Erreurs de validation (optionnel)
         */
        errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        /**
         * Horodatage de l'erreur
         * @example "2023-04-01T12:00:00Z"
         */
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}>;
/**
 * Schéma pour une réponse API générique
 */
export declare const apiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodUnion<[z.ZodObject<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: T;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>, z.ZodObject<{
    /**
     * Indique si la requête a échoué
     */
    success: z.ZodLiteral<false>;
    /**
     * Détails de l'erreur
     */
    error: z.ZodObject<{
        /**
         * Code d'erreur unique identifiant le type d'erreur
         * @example "VALIDATION_ERROR"
         */
        code: z.ZodString;
        /**
         * Message d'erreur lisible par l'humain
         * @example "La validation a échoué"
         */
        message: z.ZodString;
        /**
         * Détails supplémentaires sur l'erreur (optionnel)
         */
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        /**
         * Erreurs de validation (optionnel)
         */
        errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        /**
         * Horodatage de l'erreur
         * @example "2023-04-01T12:00:00Z"
         */
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}>]>;
/**
 * Schéma pour une réponse de liste paginée
 */
export declare const paginatedApiResponseSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodUnion<[z.ZodObject<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: z.ZodObject<{
        /**
         * Tableau des éléments de la page courante
         */
        data: z.ZodArray<T, "many">;
        /**
         * Métadonnées de pagination
         */
        meta: z.ZodObject<{
            /**
             * Numéro de la page courante (commence à 1)
             */
            currentPage: z.ZodNumber;
            /**
             * Nombre d'éléments par page
             */
            perPage: z.ZodNumber;
            /**
             * Nombre total d'éléments
             */
            total: z.ZodNumber;
            /**
             * Nombre total de pages
             */
            totalPages: z.ZodNumber;
            /**
             * Lien vers la page suivante (si elle existe)
             */
            nextPage: z.ZodOptional<z.ZodString>;
            /**
             * Lien vers la page précédente (si elle existe)
             */
            prevPage: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        }, {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        data: T["_output"][];
        meta: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        };
    }, {
        data: T["_input"][];
        meta: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        };
    }>;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    data: {
        data: T["_output"][];
        meta: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        };
    };
    success: true;
    meta?: Record<string, any> | undefined;
}, {
    data: {
        data: T["_input"][];
        meta: {
            currentPage: number;
            perPage: number;
            total: number;
            totalPages: number;
            nextPage?: string | undefined;
            prevPage?: string | undefined;
        };
    };
    success: true;
    meta?: Record<string, any> | undefined;
}>, z.ZodObject<{
    /**
     * Indique si la requête a échoué
     */
    success: z.ZodLiteral<false>;
    /**
     * Détails de l'erreur
     */
    error: z.ZodObject<{
        /**
         * Code d'erreur unique identifiant le type d'erreur
         * @example "VALIDATION_ERROR"
         */
        code: z.ZodString;
        /**
         * Message d'erreur lisible par l'humain
         * @example "La validation a échoué"
         */
        message: z.ZodString;
        /**
         * Détails supplémentaires sur l'erreur (optionnel)
         */
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        /**
         * Erreurs de validation (optionnel)
         */
        errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        /**
         * Horodatage de l'erreur
         * @example "2023-04-01T12:00:00Z"
         */
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}>]>;
/**
 * Schéma pour une réponse vide (sans données)
 */
export declare const emptyResponseSchema: z.ZodUnion<[z.ZodObject<{
    /**
     * Indique si la requête a réussi
     */
    success: z.ZodLiteral<true>;
    /**
     * Données de la réponse
     */
    data: z.ZodVoid;
    /**
     * Métadonnées supplémentaires (optionnel)
     */
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data?: void | undefined;
    meta?: Record<string, any> | undefined;
}, {
    success: true;
    data?: void | undefined;
    meta?: Record<string, any> | undefined;
}>, z.ZodObject<{
    /**
     * Indique si la requête a échoué
     */
    success: z.ZodLiteral<false>;
    /**
     * Détails de l'erreur
     */
    error: z.ZodObject<{
        /**
         * Code d'erreur unique identifiant le type d'erreur
         * @example "VALIDATION_ERROR"
         */
        code: z.ZodString;
        /**
         * Message d'erreur lisible par l'humain
         * @example "La validation a échoué"
         */
        message: z.ZodString;
        /**
         * Détails supplémentaires sur l'erreur (optionnel)
         */
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        /**
         * Erreurs de validation (optionnel)
         */
        errors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
        /**
         * Horodatage de l'erreur
         * @example "2023-04-01T12:00:00Z"
         */
        timestamp: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, any> | undefined;
        errors?: Record<string, string[]> | undefined;
        timestamp?: string | undefined;
    };
}>]>;
/**
 * Type pour une réponse d'erreur API
 */
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
/**
 * Type pour une réponse paginée
 */
export type PaginatedResponse<T> = z.infer<ReturnType<typeof paginatedResponseSchema<z.ZodType<T>>>>;
/**
 * Type pour une réponse API générique
 */
export type ApiResponse<T> = {
    success: true;
    data: T;
    meta?: Record<string, any>;
} | {
    success: false;
    error: ErrorResponse;
};
