import { inject, injectable } from 'inversify';
import { 
  controller, 
  httpPost, 
  httpGet, 
  httpPut, 
  httpDelete,
  BaseHttpController,
  requestParam,
  requestBody
} from 'inversify-express-utils';
import { Response } from 'express';

// Interface pour la réponse paginée du service utilisateur
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Interface pour les erreurs MongoDB
interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}
import { TYPES } from '../constants/types';
import { UserService } from '../domain/services/user.service';
import { 
  createUserSchema, 
  updateUserSchema,
  CreateUserDto,
  UpdateUserDto
} from '../domain/dtos/user.dto';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { UserRole } from '../domain/models/user.model';
import logger from '../infrastructure/logging/logger';
import { z } from 'zod';

// Schéma de validation pour l'ID
const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID utilisateur invalide')
});

@controller('/users')
@injectable()
export class UserController extends BaseHttpController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {
    super();
  }

  @httpPost('/', validate(createUserSchema))
  private async createUser(
    @requestBody() body: CreateUserDto
  ): Promise<Response> {
    const { response: res } = this.httpContext;
    
    try {
      const user = await this.userService.createUser(body);
      logger.info(`Utilisateur créé avec succès: ${user.id}`);
      
      return res.status(201).json({
        status: 'success',
        data: user
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors de la création de l\'utilisateur:', error);
      
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        return res.status(409).json({
          status: 'error',
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'Erreur lors de la création de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }
  @httpGet('/', authMiddleware([UserRole.ADMIN]))
  private async getUsers(): Promise<Response> {
    const { request: req, response: res } = this.httpContext;
    
    try {
      const { page = '1', limit = '10', role, search, sort } = req.query;
      
      const result = await this.userService.getUsers({
        page: Number(page),
        limit: Number(limit),
        role: role as UserRole | undefined,
        search: search as string | undefined,
        sort: sort as string | undefined
      });
      
      // Vérifier que le résultat correspond à l'interface attendue
      if (!result || typeof result !== 'object' || 
          !('data' in result) || !Array.isArray(result.data) ||
          !('total' in result) || typeof result.total !== 'number' || 
          !('page' in result) || typeof result.page !== 'number' || 
          !('limit' in result) || typeof result.limit !== 'number') {
        throw new Error('Format de réponse du service utilisateur invalide');
      }
      
      const paginatedResult = result as PaginatedResponse<unknown>;
      
      return res.json({
        status: 'success',
        data: paginatedResult.data,
        pagination: {
          total: paginatedResult.total,
          page: paginatedResult.page,
          totalPages: Math.ceil(paginatedResult.total / paginatedResult.limit),
          limit: paginatedResult.limit
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur lors de la récupération des utilisateurs: ${errorMessage}`);
      
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des utilisateurs',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  @httpGet(
    '/:id',
    validate(idParamSchema),
    authMiddleware([UserRole.ADMIN, UserRole.DELIVERY_PERSON, UserRole.CUSTOMER])
  )
  private async getUser(
    @requestParam('id') id: string
  ): Promise<Response> {
    const { request: req, response: res } = this.httpContext;
    
    try {
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé',
        });
      }
      
      // Vérifier si l'utilisateur a le droit de voir ce profil
      const currentUser = req.user as { id: string; role: UserRole } | undefined;
      if (currentUser?.role !== UserRole.ADMIN && currentUser?.id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Non autorisé à accéder à cette ressource',
        });
      }
      
      return res.json({
        status: 'success',
        data: user
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur lors de la récupération de l'utilisateur: ${errorMessage}`);
      
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  @httpPut(
    '/:id', 
    validate(idParamSchema), 
    validate(updateUserSchema),
    authMiddleware([UserRole.ADMIN, UserRole.DELIVERY_PERSON, UserRole.CUSTOMER])
  )
  private async updateUser(
    @requestParam('id') id: string,
    @requestBody() body: UpdateUserDto
  ): Promise<Response> {
    const { request: req, response: res } = this.httpContext;
    
    try {
      // Vérifier si l'utilisateur a le droit de modifier ce profil
      const currentUser = req.user as { id: string; role: UserRole } | undefined;
      if (currentUser?.role !== UserRole.ADMIN && currentUser?.id !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Non autorisé à modifier cet utilisateur',
        });
      }
      
      const updatedUser = await this.userService.updateUser(id, body);
      
      if (!updatedUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé',
        });
      }
      
      logger.info(`Utilisateur mis à jour avec succès: ${id}`);
      
      return res.json({
        status: 'success',
        data: updatedUser,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur lors de la mise à jour de l'utilisateur: ${errorMessage}`);
      
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        return res.status(409).json({
          status: 'error',
          message: 'Un utilisateur avec cet email existe déjà',
        });
      }
      
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  @httpDelete(
    '/:id',
    validate(idParamSchema),
    authMiddleware([UserRole.ADMIN])
  )
  private async deleteUser(
    @requestParam('id') id: string
  ): Promise<Response> {
    const { request: req, response: res } = this.httpContext;
    
    try {
      // Empêcher l'auto-suppression
      const currentUser = req.user as { id: string; role: UserRole } | undefined;
      if (currentUser?.id === id) {
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
      
      return res.status(204).send();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error(`Erreur lors de la suppression de l'utilisateur:`, error);
      
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la suppression de l\'utilisateur',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }
}
