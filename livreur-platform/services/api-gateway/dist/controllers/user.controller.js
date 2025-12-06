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
exports.UserController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_1 = require("../constants/types");
const user_service_1 = require("../domain/services/user.service");
const user_dto_1 = require("../domain/dtos/user.dto");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_model_1 = require("../domain/models/user.model");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
const zod_1 = require("zod");
// Schéma de validation pour l'ID
const idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID utilisateur invalide')
});
let UserController = class UserController extends inversify_express_utils_1.BaseHttpController {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    async createUser(body) {
        const { response: res } = this.httpContext;
        try {
            const user = await this.userService.createUser(body);
            logger_1.default.info(`Utilisateur créé avec succès: ${user.id}`);
            return res.status(201).json({
                status: 'success',
                data: user
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error('Erreur lors de la création de l\'utilisateur:', error);
            const mongoError = error;
            if (mongoError.code === 11000) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Un utilisateur avec cet email existe déjà',
                });
            }
            return res.status(400).json({
                status: 'error',
                message: 'Erreur lors de la création de l\'utilisateur',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    }
    async getUsers() {
        const { request: req, response: res } = this.httpContext;
        try {
            const { page = '1', limit = '10', role, search, sort } = req.query;
            const result = await this.userService.getUsers({
                page: Number(page),
                limit: Number(limit),
                role: role,
                search: search,
                sort: sort
            });
            // Vérifier que le résultat correspond à l'interface attendue
            if (!result || typeof result !== 'object' ||
                !('data' in result) || !Array.isArray(result.data) ||
                !('total' in result) || typeof result.total !== 'number' ||
                !('page' in result) || typeof result.page !== 'number' ||
                !('limit' in result) || typeof result.limit !== 'number') {
                throw new Error('Format de réponse du service utilisateur invalide');
            }
            const paginatedResult = result;
            return res.json({
                status: 'success',
                data: paginatedResult.data,
                pagination: {
                    total: paginatedResult.total,
                    page: paginatedResult.page,
                    totalPages: Math.ceil(paginatedResult.total / paginatedResult.limit),
                    limit: paginatedResult.limit
                }
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error(`Erreur lors de la récupération des utilisateurs: ${errorMessage}`);
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la récupération des utilisateurs',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    }
    async getUser(id) {
        const { request: req, response: res } = this.httpContext;
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Utilisateur non trouvé',
                });
            }
            // Vérifier si l'utilisateur a le droit de voir ce profil
            const currentUser = req.user;
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== user_model_1.UserRole.ADMIN && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) !== id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Non autorisé à accéder à cette ressource',
                });
            }
            return res.json({
                status: 'success',
                data: user
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error(`Erreur lors de la récupération de l'utilisateur: ${errorMessage}`);
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la récupération de l\'utilisateur',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    }
    async updateUser(id, body) {
        const { request: req, response: res } = this.httpContext;
        try {
            // Vérifier si l'utilisateur a le droit de modifier ce profil
            const currentUser = req.user;
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== user_model_1.UserRole.ADMIN && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) !== id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Non autorisé à modifier cet utilisateur',
                });
            }
            const updatedUser = await this.userService.updateUser(id, body);
            if (!updatedUser) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Utilisateur non trouvé',
                });
            }
            logger_1.default.info(`Utilisateur mis à jour avec succès: ${id}`);
            return res.json({
                status: 'success',
                data: updatedUser,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error(`Erreur lors de la mise à jour de l'utilisateur: ${errorMessage}`);
            const mongoError = error;
            if (mongoError.code === 11000) {
                return res.status(409).json({
                    status: 'error',
                    message: 'Un utilisateur avec cet email existe déjà',
                });
            }
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la mise à jour de l\'utilisateur',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    }
    async deleteUser(id) {
        const { request: req, response: res } = this.httpContext;
        try {
            // Empêcher l'auto-suppression
            const currentUser = req.user;
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) === id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Vous ne pouvez pas supprimer votre propre compte',
                });
            }
            const success = await this.userService.deleteUser(id);
            if (!success) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Utilisateur non trouvé',
                });
            }
            logger_1.default.info(`Utilisateur désactivé: ${id}`);
            return res.status(204).send();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error(`Erreur lors de la suppression de l'utilisateur:`, error);
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la suppression de l\'utilisateur',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            });
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/', (0, validation_middleware_1.validate)(user_dto_1.createUserSchema)),
    __param(0, (0, inversify_express_utils_1.requestBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/', (0, auth_middleware_1.authMiddleware)([user_model_1.UserRole.ADMIN])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)('/:id', (0, validation_middleware_1.validate)(idParamSchema), (0, auth_middleware_1.authMiddleware)([user_model_1.UserRole.ADMIN, user_model_1.UserRole.DELIVERY_PERSON, user_model_1.UserRole.CUSTOMER])),
    __param(0, (0, inversify_express_utils_1.requestParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)('/:id', (0, validation_middleware_1.validate)(idParamSchema), (0, validation_middleware_1.validate)(user_dto_1.updateUserSchema), (0, auth_middleware_1.authMiddleware)([user_model_1.UserRole.ADMIN, user_model_1.UserRole.DELIVERY_PERSON, user_model_1.UserRole.CUSTOMER])),
    __param(0, (0, inversify_express_utils_1.requestParam)('id')),
    __param(1, (0, inversify_express_utils_1.requestBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)('/:id', (0, validation_middleware_1.validate)(idParamSchema), (0, auth_middleware_1.authMiddleware)([user_model_1.UserRole.ADMIN])),
    __param(0, (0, inversify_express_utils_1.requestParam)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, inversify_express_utils_1.controller)('/users'),
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map