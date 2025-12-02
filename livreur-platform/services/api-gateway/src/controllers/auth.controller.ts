import { inject, injectable } from 'inversify';
import { controller, httpPost, BaseHttpController } from 'inversify-express-utils';
import { Response } from 'express';
import { TYPES } from '../constants/types';
import { UserService } from '../domain/services/user.service';
import { loginSchema } from '../domain/dtos/user.dto';
import { validate } from '../middlewares/validation.middleware';
import logger from '../infrastructure/logging/logger';

type UserRole = 'ADMIN' | 'DELIVERY_PERSON' | 'CUSTOMER';

// Extension de l'interface Request d'Express
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };
  }
}

@controller('/auth')
@injectable()
export class AuthController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {
    super();
  }

  @httpPost('/login', validate(loginSchema))
  private async login(): Promise<Response> {
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
      
      logger.info(`Utilisateur connecté avec succès: ${result.user.id}`);
      
      return res.json({
        status: 'success',
        data: result,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      
      logger.error('Échec de la tentative de connexion:', { 
        email: req.body.email,
        error: errorMessage 
      });
      
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }
  }

  @httpPost('/refresh-token')
  private async refreshToken(): Promise<Response> {
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
      
      logger.info(`Token rafraîchi pour l'utilisateur: ${result.user.id}`);
      
      return res.json({
        status: 'success',
        data: result,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      logger.error('Échec du rafraîchissement du token:', { 
        error: errorMessage 
      });
      
      return res.status(401).json({
        status: 'error',
        message: 'Jeton de rafraîchissement invalide ou expiré'
      });
    }
  }

  @httpPost('/logout')
  private async logout(): Promise<Response> {
    const { request: req, response: res } = this.httpContext;
    try {
      const userId = req.user?.id;
      
      if (userId) {
        await this.userService.invalidateToken(userId);
        logger.info(`Utilisateur déconnecté avec succès: ${userId}`);
      }
      
      return res.status(204).send();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      logger.error('Erreur lors de la déconnexion:', { 
        error: errorMessage 
      });
      
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la déconnexion'
      });
    }
  }
}
