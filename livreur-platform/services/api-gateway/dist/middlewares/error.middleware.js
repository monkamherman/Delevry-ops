"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
const class_validator_1 = require("class-validator");
function errorHandler(error, req, res, next) {
    // Log de l'erreur
    logger_1.default.error(`Erreur: ${error.message}`, {
        stack: error.stack,
        path: req.path,
        method: req.method,
        body: req.body,
    });
    // Gestion des erreurs de validation
    if (Array.isArray(error) && error[0] instanceof class_validator_1.ValidationError) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Erreur de validation',
            errors: error.map(err => ({
                property: err.property,
                constraints: err.constraints,
            })),
        });
    }
    // Gestion des erreurs personnalisées
    if ('statusCode' in error && typeof error.statusCode === 'number') {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }
    // Erreur serveur par défaut
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Une erreur est survenue sur le serveur',
    });
}
//# sourceMappingURL=error.middleware.js.map