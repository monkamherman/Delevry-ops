"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseValidator = exports.ResponseValidator = void 0;
exports.createApiResponseValidator = createApiResponseValidator;
const zod_1 = require("zod");
/**
 * Classe pour valider les réponses API avec des schémas Zod
 */
class ResponseValidator {
    constructor(options = {}) {
        this.options = {
            throwOnValidationError: true,
            strict: false,
            ...options,
        };
    }
    /**
     * Valide une réponse API par rapport à un schéma
     */
    validate(data, schema, options) {
        const mergedOptions = { ...this.options, ...options };
        try {
            if (mergedOptions.strict) {
                return schema.strict().parse(data);
            }
            return schema.parse(data);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                if (mergedOptions.onValidationError) {
                    mergedOptions.onValidationError(error, data);
                }
                if (mergedOptions.throwOnValidationError) {
                    throw this.createValidationError(error, data);
                }
                // Si throwOnValidationError est false, on retourne les données non validées
                return data;
            }
            throw error;
        }
    }
    /**
     * Valide une réponse API avec gestion des erreurs
     */
    validateApiResponse(response, dataSchema, options) {
        const apiResponseSchema = zod_1.z.object({
            success: zod_1.z.boolean(),
            data: dataSchema.optional(),
            error: zod_1.z.any().optional(),
            meta: zod_1.z.record(zod_1.z.any()).optional(),
        });
        const result = this.validate(response, apiResponseSchema, options);
        if (!result.success && result.error) {
            const error = this.validate(result.error, zod_1.z.object({
                code: zod_1.z.string(),
                message: zod_1.z.string(),
                details: zod_1.z.record(zod_1.z.any()).optional(),
                errors: zod_1.z.record(zod_1.z.array(zod_1.z.string())).optional(),
                timestamp: zod_1.z.string().datetime().optional(),
            }), options);
            return {
                success: false,
                error,
            };
        }
        return {
            success: true,
            data: result.data,
            meta: result.meta,
        };
    }
    /**
     * Crée une erreur de validation à partir d'une erreur Zod
     */
    createValidationError(error, data) {
        const issues = error.errors.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
            received: issue.received,
            expected: issue.expected,
        }));
        const validationError = new Error('Validation error');
        Object.defineProperty(validationError, 'name', { value: 'ValidationError' });
        Object.defineProperty(validationError, 'isValidationError', { value: true });
        Object.defineProperty(validationError, 'issues', { value: issues });
        Object.defineProperty(validationError, 'data', { value: data });
        return validationError;
    }
    /**
     * Crée un validateur avec des options prédéfinies
     */
    withOptions(options) {
        return new ResponseValidator({ ...this.options, ...options });
    }
}
exports.ResponseValidator = ResponseValidator;
/**
 * Instance par défaut du validateur
 */
exports.responseValidator = new ResponseValidator();
/**
 * Fonction utilitaire pour créer un validateur de réponse API
 */
function createApiResponseValidator(schema, options) {
    const validator = new ResponseValidator(options);
    return (data) => {
        return validator.validate(data, schema, options);
    };
}
