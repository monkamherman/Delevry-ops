import { inject, injectable } from 'inversify';
import { 
  controller, 
  httpPost, 
  httpGet, 
  requestParam, 
  httpPut, 
  httpDelete, 
  request, 
  response, 
  next 
} from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../constants/types';
import { UserService } from '../domain/services/user.service';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  createUserSchema, 
  updateUserSchema 
} from '../domain/dtos/user.dto';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserRole } from '../domain/models/user.model';
import logger from '../infrastructure/logging/logger';

export const idParamSchema = {
  id: { in: ['params'], isMongoId: true, errorMessage: 'ID utilisateur invalide' }
};

@controller('/users')
@injectable()
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {}

  @httpPost('/', validate(createUserSchema))
  async createUser(
    @request() req: Request, 
    @response() res: Response, 
    @next() next: NextFunction
  ) {
    try {
      const user = await this.userService.createUser(req.body);
      logger.info(`Utilisateur créé avec succès: ${user.id}`);
      
      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if ((error as any).code === 11000) {
        return res.status(409).json({
          status: 'error',
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }
      next(error);
    }
  }

  @httpGet('/', authMiddleware([UserRole.ADMIN]))
  async getUsers(
    @request() req: Request, 
    @response() res: Response, 
    @next() next: NextFunction
  ) {
    try {
      const { page = 1, limit = 10, role, search, sort } = req.query;
      
      const result = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit),
        role: role as UserRole,
        search: search as string,
        sort: sort as string
      });
      
      res.json({
        status: 'success',
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: result.limit
        }
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs:', error);
      next(error);
    }
  }

  @httpGet('/:id', validate(idParamSchema))
  async getUserById(
    @requestParam('id') id: string,
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé',
        });
      }
      
      // Vérifier si l'utilisateur a le droit de voir ce profil
      const currentUser = (req as any).user;
      if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Non autorisé à accéder à cette ressource',
        });
      }
      
      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      next(error);
    }
  }

  @httpPut(
    '/:id', 
    validate(idParamSchema), 
    validate(updateUserSchema),
    authMiddleware([UserRole.ADMIN, UserRole.DELIVERY_PERSON, UserRole.CUSTOMER])
  )
  async updateUser(
    @requestParam('id') id: string,
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      const currentUser = (req as any).user;
      
      // Vérifier les autorisations
      if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Non autorisé à modifier cet utilisateur',
        });
      }
      
      // Les clients ne peuvent pas modifier leur rôle
      if (currentUser.role === UserRole.CUSTOMER && req.body.role) {
        delete req.body.role;
      }
      
      const user = await this.userService.updateUser(id, req.body);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé',
        });
      }
      
      logger.info(`Utilisateur mis à jour: ${id}`);
      
      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      next(error);
    }
  }

  @httpDelete('/:id', validate(idParamSchema), authMiddleware([UserRole.ADMIN]))
  async deleteUser(
    @requestParam('id') id: string,
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    try {
      // Empêcher l'auto-suppression
      if ((req as any).user.id === id) {
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
      
      logger.info(`Utilisateur désactivé: ${id}`);
      
      res.status(204).send();
    } catch (error) {
      logger.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      next(error);
    }
  }
}
