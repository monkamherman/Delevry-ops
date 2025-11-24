import { inject, injectable } from 'inversify';
import { TYPES } from '../../constants/types';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User, UserRole } from '../models/user.model';
import { FilterQuery, Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import { redisClient } from '../../config/database';
import logger from '../../infrastructure/logging/logger';

const signJwt = promisify(sign) as (
  payload: string | object | Buffer,
  secretOrPrivateKey: string,
  options?: any
) => Promise<string>;

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<any>;
  getUsers(query?: Record<string, any>): Promise<any[]>;
  getUserById(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  updateUser(id: string, userData: UpdateUserDto): Promise<any>;
  deleteUser(id: string): Promise<boolean>;
  authenticateUser(email: string, password: string): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  invalidateToken(userId: string): Promise<void>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async createUser(userData: CreateUserDto): Promise<any> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.userRepository.findOne({ 
        email: userData.email 
      });
      
      if (existingUser) {
        const error = new Error('Un utilisateur avec cet email existe déjà');
        (error as any).statusCode = 409;
        throw error;
      }

      // Créer l'utilisateur
      return await this.userRepository.create(userData);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  async getUsers(query: Record<string, any> = {}): Promise<any[]> {
    try {
      const filter: FilterQuery<any> = { isActive: true };
      
      // Filtrer par rôle si spécifié
      if (query.role) {
        filter.role = query.role;
      }
      
      // Recherche par nom/prénom/email
      if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ];
      }
      
      return await this.userRepository.find(filter);
    } catch (error) {
      logger.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        const error = new Error('ID utilisateur invalide');
        (error as any).statusCode = 400;
        throw error;
      }
      
      const user = await this.userRepository.findById(id);
      
      if (!user) {
        const error = new Error('Utilisateur non trouvé');
        (error as any).statusCode = 404;
        throw error;
      }
      
      return user;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      return await this.userRepository.findOne({ email });
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'utilisateur par email ${email}:`, error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        const error = new Error('ID utilisateur invalide');
        (error as any).statusCode = 400;
        throw error;
      }
      
      // Ne pas permettre la mise à jour de l'email s'il est déjà utilisé
      if (userData.email) {
        const existingUser = await this.userRepository.findOne({ 
          email: userData.email,
          _id: { $ne: id }
        });
        
        if (existingUser) {
          const error = new Error('Un utilisateur avec cet email existe déjà');
          (error as any).statusCode = 409;
          throw error;
        }
      }
      
      const updatedUser = await this.userRepository.findByIdAndUpdate(id, userData, { new: true });
      
      if (!updatedUser) {
        const error = new Error('Utilisateur non trouvé');
        (error as any).statusCode = 404;
        throw error;
      }
      
      return updatedUser;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        const error = new Error('ID utilisateur invalide');
        (error as any).statusCode = 400;
        throw error;
      }
      
      // Désactiver l'utilisateur au lieu de le supprimer
      await this.userRepository.findByIdAndUpdate(id, { isActive: false });
      
      // Invalider les tokens de l'utilisateur
      await this.invalidateToken(id);
      
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        const error = new Error('Email ou mot de passe incorrect');
        (error as any).statusCode = 401;
        throw error;
      }
      
      if (!user.isActive) {
        const error = new Error('Ce compte a été désactivé');
        (error as any).statusCode = 403;
        throw error;
      }
      
      // Générer les tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user),
        this.generateRefreshToken(user)
      ]);
      
      // Mettre à jour la dernière connexion
      await this.userRepository.findByIdAndUpdate(user.id, { lastLogin: new Date() });
      
      // Retourner les informations de l'utilisateur (sans le mot de passe) et les tokens
      const { password: _, ...userWithoutPassword } = user.toObject();
      return {
        user: userWithoutPassword,
        token: accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Erreur lors de l\'authentification:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      // Vérifier si le refresh token est valide et non révoqué
      const userId = await this.verifyRefreshToken(refreshToken);
      
      if (!userId) {
        const error = new Error('Refresh token invalide ou expiré');
        (error as any).statusCode = 401;
        throw error;
      }
      
      // Récupérer l'utilisateur
      const user = await this.userRepository.findById(userId);
      
      if (!user || !user.isActive) {
        const error = new Error('Utilisateur non trouvé ou désactivé');
        (error as any).statusCode = 401;
        throw error;
      }
      
      // Générer un nouveau token d'accès
      const accessToken = await this.generateAccessToken(user);
      
      return {
        user,
        token: accessToken,
        refreshToken // Le même refresh token est renvoyé (peut être renouvelé si nécessaire)
      };
    } catch (error) {
      logger.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  async invalidateToken(userId: string): Promise<void> {
    try {
      // Ajouter l'utilisateur à la liste noire dans Redis
      const key = `blacklist:${userId}`;
      const ttl = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10); // 24h par défaut
      
      await redisClient.setEx(key, ttl, '1');
    } catch (error) {
      logger.error('Erreur lors de l\'invalidation du token:', error);
      throw error;
    }
  }

  private async generateAccessToken(user: any): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    return signJwt(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
  }

  private async generateRefreshToken(user: any): Promise<string> {
    const refreshToken = signJwt(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET! + 'refresh',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
    
    // Stocker le refresh token dans Redis
    const key = `refresh:${user.id}`;
    const ttl = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '604800', 10); // 7 jours par défaut
    
    await redisClient.setEx(key, ttl, refreshToken);
    
    return refreshToken;
  }

  private async verifyRefreshToken(token: string): Promise<string | null> {
    try {
      const decoded = verify(
        token,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET! + 'refresh'
      ) as { id: string };
      
      // Vérifier si le token est dans la liste noire
      const isBlacklisted = await redisClient.get(`refresh:${decoded.id}`);
      
      if (isBlacklisted !== token) {
        return null;
      }
      
      return decoded.id;
    } catch (error) {
      return null;
    }
  }
}
