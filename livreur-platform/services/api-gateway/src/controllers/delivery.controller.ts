import { Response } from "express";
import { inject, injectable } from "inversify";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestParam,
  response,
} from "inversify-express-utils";
import { TYPES } from "../constants/types";
import {
  assignDeliverySchema,
  createDeliverySchema,
  deliveryQuerySchema,
  updateDeliverySchema,
  updateStatusSchema,
} from "../domain/dtos/delivery.dto";
import { DeliveryService } from "../domain/services/delivery.service";
import logger from "../infrastructure/logging/logger";
import { validate } from "../middlewares/validation.middleware";

@controller("/deliveries")
@injectable()
export class DeliveryController {
  constructor(
    @inject(TYPES.DeliveryService)
    private readonly deliveryService: DeliveryService
  ) {}

  @httpPost("/", validate(createDeliverySchema))
  async createDelivery(@request() req: any, @response() res: Response) {
    try {
      const deliveryData = req.body;
      const userId = req.user?.id;

      const delivery = await this.deliveryService.createDelivery(
        deliveryData,
        userId
      );

      res.status(201).json({
        success: true,
        data: delivery,
        message: "Livraison créée avec succès",
      });

      logger.info(`Livraison créée: ${delivery.id} par utilisateur ${userId}`);
    } catch (error) {
      logger.error("Erreur lors de la création de livraison:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la livraison",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpGet("/", validate(deliveryQuerySchema, "query"))
  async getDeliveries(@request() req: any, @response() res: Response) {
    try {
      const query = req.query;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const result = await this.deliveryService.getDeliveries(
        query,
        userId,
        userRole
      );

      res.status(200).json({
        success: true,
        data: result,
        message: "Livraisons récupérées avec succès",
      });
    } catch (error) {
      logger.error("Erreur lors de la récupération des livraisons:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des livraisons",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpGet("/:id")
  async getDeliveryById(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const delivery = await this.deliveryService.getDeliveryById(
        id,
        userId,
        userRole
      );

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
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération de la livraison ${id}:`,
        error
      );

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

  @httpPut("/:id", validate(updateDeliverySchema))
  async updateDelivery(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const updateData = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const delivery = await this.deliveryService.updateDelivery(
        id,
        updateData,
        userId,
        userRole
      );

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

      logger.info(`Livraison mise à jour: ${id} par utilisateur ${userId}`);
    } catch (error) {
      logger.error(
        `Erreur lors de la mise à jour de la livraison ${id}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de la livraison",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpDelete("/:id")
  async deleteDelivery(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const success = await this.deliveryService.deleteDelivery(
        id,
        userId,
        userRole
      );

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

      logger.info(`Livraison supprimée: ${id} par utilisateur ${userId}`);
    } catch (error) {
      logger.error(
        `Erreur lors de la suppression de la livraison ${id}:`,
        error
      );

      if (error instanceof Error && error.message === "Accès non autorisé") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      if (
        error instanceof Error &&
        error.message.includes("Impossible de supprimer")
      ) {
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

  @httpPost("/:id/assign", validate(assignDeliverySchema))
  async assignDelivery(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const assignData = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Seuls les admins peuvent assigner les livraisons
      if (userRole !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      const delivery = await this.deliveryService.assignDelivery(
        id,
        assignData,
        userId,
        userRole
      );

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

      logger.info(
        `Livraison ${id} assignée au livreur ${assignData.livreurId} par utilisateur ${userId}`
      );
    } catch (error) {
      logger.error(
        `Erreur lors de l'assignation de la livraison ${id}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'assignation de la livraison",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpPut("/:id/status", validate(updateStatusSchema))
  async updateDeliveryStatus(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const statusData = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const delivery = await this.deliveryService.updateDeliveryStatus(
        id,
        statusData,
        userId,
        userRole
      );

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

      logger.info(
        `Statut de livraison ${id} mis à jour: ${statusData.status} par utilisateur ${userId}`
      );
    } catch (error) {
      logger.error(
        `Erreur lors de la mise à jour du statut de la livraison ${id}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du statut de la livraison",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpGet("/:id/track")
  async trackDelivery(
    @requestParam("id") id: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const trackingInfo = await this.deliveryService.trackDelivery(
        id,
        userId,
        userRole
      );

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
    } catch (error) {
      logger.error(`Erreur lors du suivi de la livraison ${id}:`, error);
      res.status(500).json({
        success: false,
        message: "Erreur lors du suivi de la livraison",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }

  @httpGet("/livreur/:livreurId")
  async getLivreurDeliveries(
    @requestParam("livreurId") livreurId: string,
    @request() req: any,
    @response() res: Response
  ) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Seul le livreur lui-même ou un admin peut voir ses livraisons
      if (userRole !== "ADMIN" && userId !== livreurId) {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      const deliveries =
        await this.deliveryService.getLivreurDeliveries(livreurId);

      res.status(200).json({
        success: true,
        data: deliveries,
        message: "Livraisons du livreur récupérées avec succès",
      });
    } catch (error) {
      logger.error(
        `Erreur lors de la récupération des livraisons du livreur ${livreurId}:`,
        error
      );
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des livraisons du livreur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }
  }
}
