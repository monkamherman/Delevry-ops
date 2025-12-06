"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.authMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const database_1 = require("../config/database");
const user_model_1 = require("../domain/models/user.model");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
const authMiddleware = (roles = []) => {
    return async (req, res, next) => {
        try {
            // Vérifier si le token est présent dans les en-têtes
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentification requise. Veuillez vous connecter.",
                });
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    status: "error",
                    message: "Token manquant. Veuillez vous connecter.",
                });
            }
            // Vérifier si le token est dans la liste noire (déconnexion)
            const isBlacklisted = await database_1.redisClient.get(`blacklist:${token}`);
            if (isBlacklisted) {
                return res.status(401).json({
                    status: "error",
                    message: "Session expirée. Veuillez vous reconnecter.",
                });
            }
            // Vérifier et décoder le token
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            // Vérifier les rôles si spécifiés
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    status: "error",
                    message: "Accès refusé. Droits insuffisants.",
                });
            }
            // Ajouter les informations de l'utilisateur à la requête
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            next();
        }
        catch (error) {
            logger_1.default.error("Erreur d'authentification:", error);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    status: "error",
                    message: "Session expirée. Veuillez vous reconnecter.",
                });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    status: "error",
                    message: "Token invalide. Veuillez vous reconnecter.",
                });
            }
            next(error);
        }
    };
};
exports.authMiddleware = authMiddleware;
// Middleware pour vérifier la propriété (l'utilisateur ne peut accéder qu'à ses propres données)
const checkOwnership = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "Authentification requise",
            });
        }
        // L'admin peut tout faire, les autres utilisateurs ne peuvent accéder qu'à leurs propres données
        if (req.user.role !== user_model_1.UserRole.ADMIN && req.user.id !== id) {
            return res.status(403).json({
                status: "error",
                message: "Accès non autorisé à cette ressource",
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkOwnership = checkOwnership;
//# sourceMappingURL=auth.middleware.js.map