"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResponseSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
// Schéma de base pour la création d'utilisateur
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    phoneNumber: zod_1.z.string().optional(),
    role: zod_1.z.nativeEnum(user_model_1.UserRole).optional().default(user_model_1.UserRole.CUSTOMER),
    isActive: zod_1.z.boolean().optional().default(true),
});
// Schéma pour la mise à jour d'utilisateur
exports.updateUserSchema = exports.createUserSchema
    .partial()
    .omit({ password: true });
// Schéma pour la connexion
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email invalide'),
    password: zod_1.z.string().min(1, 'Le mot de passe est requis'),
});
// Schéma pour la réponse d'authentification
exports.authResponseSchema = zod_1.z.object({
    user: zod_1.z.object({
        id: zod_1.z.string(),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
        role: zod_1.z.nativeEnum(user_model_1.UserRole),
    }),
    token: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
});
//# sourceMappingURL=user.dto.js.map