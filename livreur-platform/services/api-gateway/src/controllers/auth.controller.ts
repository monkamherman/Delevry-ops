import { inject, injectable } from 'inversify';
import { controller, httpPost, request, response, next } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../constants/types';
import { UserService } from '../domain/services/user.service';
import { loginSchema } from '../domain/dtos/user.dto';
import { validate } from '../middlewares/validation.middleware';
import logger from '../infrastructure/logging/logger';

@controller('/auth')
@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  @httpPost('/login', validate(loginSchema))
  async login(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      const result = await this.userService.authenticateUser(email, password);
      
      logger.info(`Utilisateur connecté avec succès: ${result.user.id}`);
      
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Échec de la tentative de connexion:', { 
        email: req.body.email,
        error: error.message 
      });
      next(error);
    }
  }

  @httpPost('/refresh-token')
  async refreshToken(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        const error = new Error('Le refresh token est requis');
        (error as any).statusCode = 400;
        throw error;
      }
      
      const result = await this.userService.refreshToken(refreshToken);
      
      logger.info(`Token rafraîchi pour l'utilisateur: ${result.user.id}`);
      
      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Échec du rafraîchissement du token:', { 
        error: error.message 
      });
      next(error);
    }
  }

  @httpPost('/logout')
  async logout(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      
      if (userId) {
        await this.userService.invalidateToken(userId);
        logger.info(`Utilisateur déconnecté avec succès: ${userId}`);
      }
      
      res.status(204).send();
    } catch (error) {
      logger.error('Erreur lors de la déconnexion:', { 
        error: error.message 
      });
      next(error);
    }
  }
}
