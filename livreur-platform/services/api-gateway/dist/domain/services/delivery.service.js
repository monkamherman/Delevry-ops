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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../../infrastructure/logging/logger"));
let DeliveryService = class DeliveryService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createDelivery(deliveryData, userId) {
        try {
            const delivery = await this.prisma.delivery.create({
                data: {
                    clientId: deliveryData.clientId,
                    status: "PENDING",
                    addresses: deliveryData.addresses,
                },
            });
            logger_1.default.info(`Livraison créée: ${delivery.id} par utilisateur ${userId}`);
            return delivery;
        }
        catch (error) {
            logger_1.default.error("Erreur lors de la création de livraison:", error);
            throw new Error("Impossible de créer la livraison");
        }
    }
    async getDeliveries(query, userId, userRole) {
        try {
            const { page = 1, limit = 20, status, clientId, livreurId, dateFrom, dateTo, priority, sortBy = "createdAt", sortOrder = "desc" } = query;
            const skip = (page - 1) * limit;
            const where = {};
            if (userRole === "CUSTOMER" && userId) {
                where.clientId = userId;
            }
            else if (userRole === "DELIVERY_PERSON" && userId) {
                where.livreurId = userId;
            }
            if (status)
                where.status = status;
            if (clientId)
                where.clientId = clientId;
            if (livreurId)
                where.livreurId = livreurId;
            if (priority)
                where.priority = priority;
            if (dateFrom || dateTo) {
                where.createdAt = {};
                if (dateFrom)
                    where.createdAt.gte = dateFrom;
                if (dateTo)
                    where.createdAt.lte = dateTo;
            }
            const [deliveries, total] = await Promise.all([
                this.prisma.delivery.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                this.prisma.delivery.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                items: deliveries,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            logger_1.default.error("Erreur lors de la récupération des livraisons:", error);
            throw new Error("Impossible de récupérer les livraisons");
        }
    }
    async getDeliveryById(id, userId, userRole) {
        try {
            const delivery = await this.prisma.delivery.findUnique({
                where: { id }
            });
            if (!delivery) {
                return null;
            }
            if (userRole === "CUSTOMER" && delivery.clientId !== userId) {
                throw new Error("Accès non autorisé");
            }
            if (userRole === "DELIVERY_PERSON" && delivery.livreurId !== userId) {
                throw new Error("Accès non autorisé");
            }
            return delivery;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération de la livraison ${id}:`, error);
            throw error;
        }
    }
    async updateDelivery(id, updateData, userId, userRole) {
        try {
            const existingDelivery = await this.getDeliveryById(id, userId, userRole);
            if (!existingDelivery) {
                return null;
            }
            const delivery = await this.prisma.delivery.update({
                where: { id },
                data: updateData,
            });
            logger_1.default.info(`Livraison mise à jour: ${id} par utilisateur ${userId}`);
            return delivery;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la mise à jour de la livraison ${id}:`, error);
            throw new Error("Impossible de mettre à jour la livraison");
        }
    }
    async deleteDelivery(id, userId, userRole) {
        try {
            const existingDelivery = await this.getDeliveryById(id, userId, userRole);
            if (!existingDelivery) {
                return false;
            }
            if (existingDelivery.status !== "PENDING" && userRole !== "ADMIN") {
                throw new Error("Impossible de supprimer une livraison qui n'est pas en attente");
            }
            await this.prisma.delivery.delete({
                where: { id },
            });
            logger_1.default.info(`Livraison supprimée: ${id} par utilisateur ${userId}`);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la suppression de la livraison ${id}:`, error);
            throw error;
        }
    }
    async assignDelivery(id, assignData, userId, userRole) {
        try {
            const existingDelivery = await this.getDeliveryById(id, userId, userRole);
            if (!existingDelivery) {
                return null;
            }
            if (existingDelivery.status !== "PENDING") {
                throw new Error("Impossible d'assigner une livraison qui n'est pas en attente");
            }
            const delivery = await this.prisma.delivery.update({
                where: { id },
                data: {
                    livreurId: assignData.livreurId,
                    status: "ASSIGNED",
                    assignedAt: new Date(),
                },
            });
            logger_1.default.info(`Livraison ${id} assignée au livreur ${assignData.livreurId} par utilisateur ${userId}`);
            return delivery;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de l'assignation de la livraison ${id}:`, error);
            throw error;
        }
    }
    async updateDeliveryStatus(id, statusData, userId, userRole) {
        try {
            const existingDelivery = await this.getDeliveryById(id, userId, userRole);
            if (!existingDelivery) {
                return null;
            }
            const updateData = {
                status: statusData.status,
            };
            switch (statusData.status) {
                case "IN_PROGRESS":
                    updateData.startedAt = new Date();
                    break;
                case "DELIVERED":
                    updateData.completedAt = new Date();
                    break;
                case "CANCELLED":
                    updateData.cancelledAt = new Date();
                    break;
            }
            const delivery = await this.prisma.delivery.update({
                where: { id },
                data: updateData,
            });
            logger_1.default.info(`Statut de livraison ${id} mis à jour: ${statusData.status} par utilisateur ${userId}`);
            return delivery;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la mise à jour du statut de la livraison ${id}:`, error);
            throw error;
        }
    }
    async trackDelivery(id, userId, userRole) {
        try {
            const delivery = await this.getDeliveryById(id, userId, userRole);
            if (!delivery) {
                return null;
            }
            const tracking = {
                delivery,
                currentLocation: undefined,
                estimatedArrival: undefined,
                progress: this.calculateProgress(delivery),
                remainingDistance: undefined,
                remainingTime: undefined,
                lastUpdate: new Date().toISOString(),
            };
            return tracking;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors du suivi de la livraison ${id}:`, error);
            throw error;
        }
    }
    calculateProgress(delivery) {
        switch (delivery.status) {
            case "PENDING":
                return 0;
            case "ASSIGNED":
                return 10;
            case "IN_PROGRESS":
                return 50;
            case "DELIVERED":
                return 100;
            case "CANCELLED":
            case "FAILED":
                return 0;
            default:
                return 0;
        }
    }
    async getLivreurDeliveries(livreurId) {
        try {
            const deliveries = await this.prisma.delivery.findMany({
                where: {
                    livreurId,
                    status: {
                        in: ["ASSIGNED", "IN_PROGRESS"],
                    },
                },
                orderBy: { createdAt: "asc" },
            });
            return deliveries;
        }
        catch (error) {
            logger_1.default.error(`Erreur lors de la récupération des livraisons du livreur ${livreurId}:`, error);
            throw new Error("Impossible de récupérer les livraisons du livreur");
        }
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map