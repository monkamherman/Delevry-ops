"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = void 0;
exports.validate = validate;
exports.validationErrorHandler = validationErrorHandler;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
/**
 * Middleware de validation des données d'entrée avec Zod
 * @param schema Schéma Zod pour valider la requête
 * @param target La cible de la requête à valider (body, params, query, etc.)
 * @returns Middleware Express
 */
function validate(schema, target = 'body') {
    return async (req, res, next) => {
        try {
            // Valider les données avec le schéma Zod
            const result = await schema.safeParseAsync(req[target]);
            if (!result.success) {
                const formattedErrors = formatZodErrors(result.error);
                logger_1.default.warn(`Validation échouée: ${JSON.stringify(formattedErrors)}`, {
                    path: req.path,
                    method: req.method,
                    [target]: req[target],
                });
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: 'error',
                    message: 'Erreur de validation des données',
                    errors: formattedErrors,
                });
            }
            // Remplacer les données par les données validées (avec les valeurs par défaut)
            req[target] = result.data;
            next();
        }
        catch (error) {
            logger_1.default.error('Erreur lors de la validation:', error);
            next(error);
        }
    };
}
/**
 * Formate les erreurs Zod dans un format plus lisible
 */
function formatZodErrors(error) {
    return error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
    }));
}
/**
 * Gestionnaire d'erreurs de validation global
 */
function validationErrorHandler(error, req, res, next) {
    if (error instanceof zod_1.ZodError) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Erreur de validation des données',
            errors: formatZodErrors(error),
        });
    }
    // Si ce n'est pas une erreur de validation, passer au prochain middleware d'erreur
    next(error);
}
/**
 * Middleware pour valider l'ID des paramètres de requête
 */
exports.validateIdParam = validate(zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide'),
}), 'params');
//# sourceMappingURL=validation.middleware.js.map