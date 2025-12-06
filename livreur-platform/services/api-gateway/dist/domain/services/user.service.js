"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../constants/types");
const user_repository_1 = require("../repositories/user.repository");
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const util_1 = require("util");
const database_1 = require("../../config/database");
const logger_1 = __importDefault(require("../../infrastructure/logging/logger"));
const signJwt = (0, util_1.promisify)(jsonwebtoken_1.sign);
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(userData) {
        try {
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.userRepository.findOne({
                email: userData.email
            });
            if (existingUser) {
                const error = new Error('Un utilisateur avec cet email existe déjà');
                error.statusCode = 409;
                throw error;
            }
            // Créer l'utilisateur
            return await this.userRepository.create(userData);
        }
        catch (error) {
            logger_1.default.error('Erreur lors de la création de l\'utilisateur:', error);
            throw error;
        }
    }
    async getUsers(query = {}) {
        try {
            const filter = { isActive: true };
            // Filtrer par rôle si spécifié
            if (query.role) {
                filter.role = query.role;
            }
            // Recherche par nom/prénom/email
            if (query.search) {
                const searchRegex = new RegExp(query.search, 'i');
                filter.$or = [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                ];
            }
            return await this.userRepository.find(filter);
        }
        catch (error) {
            logger_1.default.error('Erreur lors de la récupération des utilisateurs:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                const error = new Error('ID utilisateur invalide');
                error.statusCode = 400;
                throw error;
            }
            const user = await this.userRepository.findById(id);
            if (!user) {
                const error = new Error('Utilisateur non trouvé');
                error.statusCode = 404;
                throw error;
            }
            return user;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
            throw error;
        }
    }
    async getUserByEmail(email) {
        try {
            return await this.userRepository.findOne({ email });
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération de l'utilisateur par email ${email}:`, error);
            throw error;
        }
    }
    async updateUser(id, userData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                const error = new Error('ID utilisateur invalide');
                error.statusCode = 400;
                throw error;
            }
            // Ne pas permettre la mise à jour de l'email s'il est déjà utilisé
            if (userData.email) {
                const existingUser = await this.userRepository.findOne({
                    email: userData.email,
                    _id: { $ne: id }
                });
                if (existingUser) {
                    const error = new Error('Un utilisateur avec cet email existe déjà');
                    error.statusCode = 409;
                    throw error;
                }
            }
            const updatedUser = await this.userRepository.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) {
                const error = new Error('Utilisateur non trouvé');
                error.statusCode = 404;
                throw error;
            }
            return updatedUser;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                const error = new Error('ID utilisateur invalide');
                error.statusCode = 400;
                throw error;
            }
            // Désactiver l'utilisateur au lieu de le supprimer
            await this.userRepository.findByIdAndUpdate(id, { isActive: false });
            // Invalider les tokens de l'utilisateur
            await this.invalidateToken(id);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
            throw error;
        }
    }
    async authenticateUser(email, password) {
        try {
            const user = await this.userRepository.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                const error = new Error('Email ou mot de passe incorrect');
                error.statusCode = 401;
                throw error;
            }
            if (!user.isActive) {
                const error = new Error('Ce compte a été désactivé');
                error.statusCode = 403;
                throw error;
            }
            // Générer les tokens
            const [accessToken, refreshToken] = await Promise.all([
                this.generateAccessToken(user),
                this.generateRefreshToken(user)
            ]);
            // Mettre à jour la dernière connexion
            await this.userRepository.findByIdAndUpdate(user.id, { lastLogin: new Date() });
            // Retourner les informations de l'utilisateur (sans le mot de passe) et les tokens
            const { password: _, ...userWithoutPassword } = user.toObject();
            return {
                user: userWithoutPassword,
                token: accessToken,
                refreshToken
            };
        }
        catch (error) {
            logger_1.default.error('Erreur lors de l\'authentification:', error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            // Vérifier si le refresh token est valide et non révoqué
            const userId = await this.verifyRefreshToken(refreshToken);
            if (!userId) {
                const error = new Error('Refresh token invalide ou expiré');
                error.statusCode = 401;
                throw error;
            }
            // Récupérer l'utilisateur
            const user = await this.userRepository.findById(userId);
            if (!user || !user.isActive) {
                const error = new Error('Utilisateur non trouvé ou désactivé');
                error.statusCode = 401;
                throw error;
            }
            // Générer un nouveau token d'accès
            const accessToken = await this.generateAccessToken(user);
            return {
                user,
                token: accessToken,
                refreshToken // Le même refresh token est renvoyé (peut être renouvelé si nécessaire)
            };
        }
        catch (error) {
            logger_1.default.error('Erreur lors du rafraîchissement du token:', error);
            throw error;
        }
    }
    async invalidateToken(userId) {
        try {
            // Ajouter l'utilisateur à la liste noire dans Redis
            const key = `blacklist:${userId}`;
            const ttl = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // 24h par défaut
            await database_1.redisClient.setEx(key, ttl, '1');
        }
        catch (error) {
            logger_1.default.error('Erreur lors de l\'invalidation du token:', error);
            throw error;
        }
    }
    async generateAccessToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        return signJwt(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });
    }
    async generateRefreshToken(user) {
        const refreshToken = signJwt({ id: user.id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + 'refresh', { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
        // Stocker le refresh token dans Redis
        const key = `refresh:${user.id}`;
        const ttl = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '604800', 10); // 7 jours par défaut
        await database_1.redisClient.setEx(key, ttl, refreshToken);
        return refreshToken;
    }
    async verifyRefreshToken(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + 'refresh');
            // Vérifier si le token est dans la liste noire
            const isBlacklisted = await database_1.redisClient.get(`refresh:${decoded.id}`);
            if (isBlacklisted !== token) {
                return null;
            }
            return decoded.id;
        }
        catch (error) {
            return null;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map