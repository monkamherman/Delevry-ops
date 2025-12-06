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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_1 = require("../constants/types");
const user_service_1 = require("../domain/services/user.service");
const user_dto_1 = require("../domain/dtos/user.dto");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
let AuthController = class AuthController extends inversify_express_utils_1.BaseHttpController {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    async login() {
        const { request: req, response: res } = this.httpContext;
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email et mot de passe sont requis'
                });
            }
            const result = await this.userService.authenticateUser(email, password);
            logger_1.default.info(`Utilisateur connecté avec succès: ${result.user.id}`);
            return res.json({
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
            logger_1.default.error('Échec de la tentative de connexion:', {
                email: req.body.email,
                error: errorMessage
            });
            return res.status(401).json({
                status: 'error',
                message: 'Identifiants invalides'
            });
        }
    }
    async refreshToken() {
        const { request: req, response: res } = this.httpContext;
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Le refresh token est requis'
                });
            }
            const result = await this.userService.refreshToken(refreshToken);
            logger_1.default.info(`Token rafraîchi pour l'utilisateur: ${result.user.id}`);
            return res.json({
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error('Échec du rafraîchissement du token:', {
                error: errorMessage
            });
            return res.status(401).json({
                status: 'error',
                message: 'Jeton de rafraîchissement invalide ou expiré'
            });
        }
    }
    async logout() {
        var _a;
        const { request: req, response: res } = this.httpContext;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (userId) {
                await this.userService.invalidateToken(userId);
                logger_1.default.info(`Utilisateur déconnecté avec succès: ${userId}`);
            }
            return res.status(204).send();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            logger_1.default.error('Erreur lors de la déconnexion:', {
                error: errorMessage
            });
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la déconnexion'
            });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, inversify_express_utils_1.httpPost)('/login', (0, validation_middleware_1.validate)(user_dto_1.loginSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/refresh-token'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)('/logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, inversify_express_utils_1.controller)('/auth'),
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map