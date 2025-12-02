import { z, ZodError, ZodSchema, ZodType } from 'zod';
import { ApiResponse } from './schemas';
/**
 * Options pour le validateur de réponses
 */
export interface ResponseValidatorOptions {
    /**
     * Si vrai, lève une exception en cas d'erreur de validation
     * @default true
     */
    throwOnValidationError?: boolean;
    /**
     * Si vrai, valide strictement (rejette les champs supplémentaires)
     * @default false
     */
    strict?: boolean;
    /**
     * Callback appelé en cas d'erreur de validation
     */
    onValidationError?: (error: ZodError, data: unknown) => void;
}
/**
 * Classe pour valider les réponses API avec des schémas Zod
 */
export declare class ResponseValidator {
    private options;
    constructor(options?: ResponseValidatorOptions);
    /**
     * Valide une réponse API par rapport à un schéma
     */
    validate<T>(data: unknown, schema: ZodSchema<T>, options?: ResponseValidatorOptions): T;
    /**
     * Valide une réponse API avec gestion des erreurs
     */
    validateApiResponse<T>(response: unknown, dataSchema: ZodSchema<T>, options?: ResponseValidatorOptions): ApiResponse<T>;
    /**
     * Crée une erreur de validation à partir d'une erreur Zod
     */
    private createValidationError;
    /**
     * Crée un validateur avec des options prédéfinies
     */
    withOptions(options: ResponseValidatorOptions): ResponseValidator;
}
/**
 * Instance par défaut du validateur
 */
export declare const responseValidator: ResponseValidator;
/**
 * Fonction utilitaire pour créer un validateur de réponse API
 */
export declare function createApiResponseValidator<T extends ZodType>(schema: T, options?: ResponseValidatorOptions): (data: unknown) => z.infer<T>;
/**
 * Type utilitaire pour extraire le type d'un schéma Zod
 */
export type InferSchemaType<T> = T extends ZodSchema<infer U> ? U : never;
