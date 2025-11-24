import { z } from 'zod';
import { UserRole } from '../models/user.model';

// Schéma de base pour la création d'utilisateur
export const createUserSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  phoneNumber: z.string().optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.CUSTOMER),
  isActive: z.boolean().optional().default(true),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// Schéma pour la mise à jour d'utilisateur
export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true });

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Schéma pour la réponse d'authentification
export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
  }),
  token: z.string(),
  refreshToken: z.string(),
});

export type AuthResponseDto = z.infer<typeof authResponseSchema>;
