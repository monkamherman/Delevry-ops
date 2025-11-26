import { NextFunction, Request, Response } from "express";
import Redis from "ioredis";
import { verify } from "jsonwebtoken";

export enum UserRole {
  ADMIN = "ADMIN",
  DELIVERY_PERSON = "DELIVERY_PERSON",
  CUSTOMER = "CUSTOMER",
}

// Initialisation vraie instance Redis
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

export const authMiddleware = (roles: UserRole[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
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

      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          status: "error",
          message: "Session expirée. Veuillez vous reconnecter.",
        });
      }

      const decoded = verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: UserRole;
        iat: number;
        exp: number;
      };

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          status: "error",
          message: "Accès refusé. Droits insuffisants.",
        });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Session expirée. Veuillez vous reconnecter.",
        });
      }

      return res.status(401).json({
        status: "error",
        message: "Authentification invalide.",
      });
    }
  };
};
