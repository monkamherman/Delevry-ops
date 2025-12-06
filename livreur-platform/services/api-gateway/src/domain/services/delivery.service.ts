import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import logger from "../../infrastructure/logging/logger";
import {
  AssignDeliveryDto,
  CreateDeliveryDto,
  DeliveryQueryDto,
  UpdateDeliveryDto,
  UpdateStatusDto,
} from "../dtos/delivery.dto";
import { Delivery, DeliveryTracking } from "../models/delivery.model";

@injectable()
export class DeliveryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDelivery(
    deliveryData: CreateDeliveryDto,
    userId: string
  ): Promise<Delivery> {
    try {
      const delivery = await this.prisma.delivery.create({
        data: {
          clientId: deliveryData.clientId,
          status: "PENDING",
          addresses: deliveryData.addresses as any,
        },
      });

      logger.info(`Livraison créée: ${delivery.id} par utilisateur ${userId}`);
      return delivery as unknown as Delivery;
    } catch (error) {
      logger.error("Erreur lors de la création de livraison:", error);
      throw new Error("Impossible de créer la livraison");
    }
  }

  async getDeliveries(
    query: DeliveryQueryDto,
    userId?: string,
    userRole?: string
  ): Promise<{ items: Delivery[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const { page = 1, limit = 20, status, clientId, livreurId, dateFrom, dateTo, priority, sortBy = "createdAt", sortOrder = "desc" } = query;
      
      const skip = (page - 1) * limit;
      const where: any = {};

      if (userRole === "CUSTOMER" && userId) {
        where.clientId = userId;
      } else if (userRole === "DELIVERY_PERSON" && userId) {
        where.livreurId = userId;
      }

      if (status) where.status = status;
      if (clientId) where.clientId = clientId;
      if (livreurId) where.livreurId = livreurId;
      if (priority) where.priority = priority;
      
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = dateFrom;
        if (dateTo) where.createdAt.lte = dateTo;
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
        items: deliveries as unknown as Delivery[],
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      logger.error("Erreur lors de la récupération des livraisons:", error);
      throw new Error("Impossible de récupérer les livraisons");
    }
  }

  async getDeliveryById(id: string, userId?: string, userRole?: string): Promise<Delivery | null> {
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

      return delivery as unknown as Delivery;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la livraison ${id}:`, error);
      throw error;
    }
  }

  async updateDelivery(
    id: string,
    updateData: UpdateDeliveryDto,
    userId?: string,
    userRole?: string
  ): Promise<Delivery | null> {
    try {
      const existingDelivery = await this.getDeliveryById(id, userId, userRole);
      if (!existingDelivery) {
        return null;
      }

      const delivery = await this.prisma.delivery.update({
        where: { id },
        data: updateData as any,
      });

      logger.info(`Livraison mise à jour: ${id} par utilisateur ${userId}`);
      return delivery as unknown as Delivery;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la livraison ${id}:`, error);
      throw new Error("Impossible de mettre à jour la livraison");
    }
  }

  async deleteDelivery(id: string, userId?: string, userRole?: string): Promise<boolean> {
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

      logger.info(`Livraison supprimée: ${id} par utilisateur ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la suppression de la livraison ${id}:`, error);
      throw error;
    }
  }

  async assignDelivery(
    id: string,
    assignData: AssignDeliveryDto,
    userId?: string,
    userRole?: string
  ): Promise<Delivery | null> {
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
        } as any,
      });

      logger.info(`Livraison ${id} assignée au livreur ${assignData.livreurId} par utilisateur ${userId}`);
      return delivery as unknown as Delivery;
    } catch (error) {
      logger.error(`Erreur lors de l'assignation de la livraison ${id}:`, error);
      throw error;
    }
  }

  async updateDeliveryStatus(
    id: string,
    statusData: UpdateStatusDto,
    userId?: string,
    userRole?: string
  ): Promise<Delivery | null> {
    try {
      const existingDelivery = await this.getDeliveryById(id, userId, userRole);
      if (!existingDelivery) {
        return null;
      }

      const updateData: any = {
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
        data: updateData as any,
      });

      logger.info(`Statut de livraison ${id} mis à jour: ${statusData.status} par utilisateur ${userId}`);
      return delivery as unknown as Delivery;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du statut de la livraison ${id}:`, error);
      throw error;
    }
  }

  async trackDelivery(id: string, userId?: string, userRole?: string): Promise<DeliveryTracking | null> {
    try {
      const delivery = await this.getDeliveryById(id, userId, userRole);
      if (!delivery) {
        return null;
      }

      const tracking: DeliveryTracking = {
        delivery,
        currentLocation: undefined,
        estimatedArrival: undefined,
        progress: this.calculateProgress(delivery),
        remainingDistance: undefined,
        remainingTime: undefined,
        lastUpdate: new Date().toISOString(),
      };

      return tracking;
    } catch (error) {
      logger.error(`Erreur lors du suivi de la livraison ${id}:`, error);
      throw error;
    }
  }

  private calculateProgress(delivery: Delivery): number {
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

  async getLivreurDeliveries(livreurId: string): Promise<Delivery[]> {
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

      return deliveries as unknown as Delivery[];
    } catch (error) {
      logger.error(`Erreur lors de la récupération des livraisons du livreur ${livreurId}:`, error);
      throw new Error("Impossible de récupérer les livraisons du livreur");
    }
  }
}
