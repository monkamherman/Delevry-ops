import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { redisClient } from "../config/database";
import { UserRole } from "../domain/models/user.model";
import logger from "../infrastructure/logging/logger";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authMiddleware = (roles: UserRole[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);

      if (isBlacklisted) {
        return res.status(401).json({
          status: "error",
          message: "Session expirée. Veuillez vous reconnecter.",
        });
      }

      // Vérifier et décoder le token
      const decoded = verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: UserRole;
        iat: number;
        exp: number;
      };

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
    } catch (error) {
      logger.error("Erreur d'authentification:", error);

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

// Middleware pour vérifier la propriété (l'utilisateur ne peut accéder qu'à ses propres données)
export const checkOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentification requise",
      });
    }

    // L'admin peut tout faire, les autres utilisateurs ne peuvent accéder qu'à leurs propres données
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      return res.status(403).json({
        status: "error",
        message: "Accès non autorisé à cette ressource",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
