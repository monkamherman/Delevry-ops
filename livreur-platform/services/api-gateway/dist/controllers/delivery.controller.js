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
exports.DeliveryController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_1 = require("../constants/types");
const delivery_dto_1 = require("../domain/dtos/delivery.dto");
const delivery_service_1 = require("../domain/services/delivery.service");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
const validation_middleware_1 = require("../middlewares/validation.middleware");
let DeliveryController = class DeliveryController {
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    async createDelivery(req, res) {
        var _a;
        try {
            const deliveryData = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const delivery = await this.deliveryService.createDelivery(deliveryData, userId);
            res.status(201).json({
                success: true,
                data: delivery,
                message: "Livraison créée avec succès",
            });
            logger_1.default.info(`Livraison créée: ${delivery.id} par utilisateur ${userId}`);
        }
        catch (error) {
            logger_1.default.error("Erreur lors de la création de livraison:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la création de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async getDeliveries(req, res) {
        var _a, _b;
        try {
            const query = req.query;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const result = await this.deliveryService.getDeliveries(query, userId, userRole);
            res.status(200).json({
                success: true,
                data: result,
                message: "Livraisons récupérées avec succès",
            });
        }
        catch (error) {
            logger_1.default.error("Erreur lors de la récupération des livraisons:", error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des livraisons",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async getDeliveryById(id, req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const delivery = await this.deliveryService.getDeliveryById(id, userId, userRole);
            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                data: delivery,
                message: "Livraison récupérée avec succès",
            });
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération de la livraison ${id}:`, error);
            if (error instanceof Error && error.message === "Accès non autorisé") {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé",
                });
            }
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async updateDelivery(id, req, res) {
        var _a, _b;
        try {
            const updateData = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const delivery = await this.deliveryService.updateDelivery(id, updateData, userId, userRole);
            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                data: delivery,
                message: "Livraison mise à jour avec succès",
            });
            logger_1.default.info(`Livraison mise à jour: ${id} par utilisateur ${userId}`);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la mise à jour de la livraison ${id}:`, error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async deleteDelivery(id, req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const success = await this.deliveryService.deleteDelivery(id, userId, userRole);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                message: "Livraison supprimée avec succès",
            });
            logger_1.default.info(`Livraison supprimée: ${id} par utilisateur ${userId}`);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la suppression de la livraison ${id}:`, error);
            if (error instanceof Error && error.message === "Accès non autorisé") {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé",
                });
            }
            if (error instanceof Error &&
                error.message.includes("Impossible de supprimer")) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            res.status(500).json({
                success: false,
                message: "Erreur lors de la suppression de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async assignDelivery(id, req, res) {
        var _a, _b;
        try {
            const assignData = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            // Seuls les admins peuvent assigner les livraisons
            if (userRole !== "ADMIN") {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé",
                });
            }
            const delivery = await this.deliveryService.assignDelivery(id, assignData, userId, userRole);
            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                data: delivery,
                message: "Livraison assignée avec succès",
            });
            logger_1.default.info(`Livraison ${id} assignée au livreur ${assignData.livreurId} par utilisateur ${userId}`);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de l'assignation de la livraison ${id}:`, error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de l'assignation de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async updateDeliveryStatus(id, req, res) {
        var _a, _b;
        try {
            const statusData = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const delivery = await this.deliveryService.updateDeliveryStatus(id, statusData, userId, userRole);
            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                data: delivery,
                message: "Statut de livraison mis à jour avec succès",
            });
            logger_1.default.info(`Statut de livraison ${id} mis à jour: ${statusData.status} par utilisateur ${userId}`);
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la mise à jour du statut de la livraison ${id}:`, error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la mise à jour du statut de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async trackDelivery(id, req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            const trackingInfo = await this.deliveryService.trackDelivery(id, userId, userRole);
            if (!trackingInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Livraison non trouvée",
                });
            }
            res.status(200).json({
                success: true,
                data: trackingInfo,
                message: "Informations de suivi récupérées avec succès",
            });
        }
        catch (error) {
            logger_1.default.error(`Erreur lors du suivi de la livraison ${id}:`, error);
            res.status(500).json({
                success: false,
                message: "Erreur lors du suivi de la livraison",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
    async getLivreurDeliveries(livreurId, req, res) {
        var _a, _b;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
            // Seul le livreur lui-même ou un admin peut voir ses livraisons
            if (userRole !== "ADMIN" && userId !== livreurId) {
                return res.status(403).json({
                    success: false,
                    message: "Accès non autorisé",
                });
            }
            const deliveries = await this.deliveryService.getLivreurDeliveries(livreurId);
            res.status(200).json({
                success: true,
                data: deliveries,
                message: "Livraisons du livreur récupérées avec succès",
            });
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération des livraisons du livreur ${livreurId}:`, error);
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération des livraisons du livreur",
                error: error instanceof Error ? error.message : "Erreur inconnue",
            });
        }
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, inversify_express_utils_1.httpPost)("/", (0, validation_middleware_1.validate)(delivery_dto_1.createDeliverySchema)),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "createDelivery", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/", (0, validation_middleware_1.validate)(delivery_dto_1.deliveryQuerySchema, "query")),
    __param(0, (0, inversify_express_utils_1.request)()),
    __param(1, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveries", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getDeliveryById", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:id", (0, validation_middleware_1.validate)(delivery_dto_1.updateDeliverySchema)),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateDelivery", null);
__decorate([
    (0, inversify_express_utils_1.httpDelete)("/:id"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "deleteDelivery", null);
__decorate([
    (0, inversify_express_utils_1.httpPost)("/:id/assign", (0, validation_middleware_1.validate)(delivery_dto_1.assignDeliverySchema)),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "assignDelivery", null);
__decorate([
    (0, inversify_express_utils_1.httpPut)("/:id/status", (0, validation_middleware_1.validate)(delivery_dto_1.updateStatusSchema)),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "updateDeliveryStatus", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/:id/track"),
    __param(0, (0, inversify_express_utils_1.requestParam)("id")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "trackDelivery", null);
__decorate([
    (0, inversify_express_utils_1.httpGet)("/livreur/:livreurId"),
    __param(0, (0, inversify_express_utils_1.requestParam)("livreurId")),
    __param(1, (0, inversify_express_utils_1.request)()),
    __param(2, (0, inversify_express_utils_1.response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DeliveryController.prototype, "getLivreurDeliveries", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, inversify_express_utils_1.controller)("/deliveries"),
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.DeliveryService)),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map