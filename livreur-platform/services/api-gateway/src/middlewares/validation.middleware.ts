import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z, ZodError, ZodSchema } from 'zod';
import logger from '../infrastructure/logging/logger';

/**
 * Middleware de validation des données d'entrée avec Zod
 * @param schema Schéma Zod pour valider la requête
 * @param target La cible de la requête à valider (body, params, query, etc.)
 * @returns Middleware Express
 */
export function validate<T>(
  schema: ZodSchema<T>,
  target: 'body' | 'query' | 'params' = 'body'
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valider les données avec le schéma Zod
      const result = await schema.safeParseAsync(req[target]);
      
      if (!result.success) {
        const formattedErrors = formatZodErrors(result.error);
        
        logger.warn(`Validation échouée: ${JSON.stringify(formattedErrors)}`, {
          path: req.path,
          method: req.method,
          [target]: req[target],
        });
        
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'error',
          message: 'Erreur de validation des données',
          errors: formattedErrors,
        });
      }
      
      // Remplacer les données par les données validées (avec les valeurs par défaut)
      req[target] = result.data;
      next();
    } catch (error) {
      logger.error('Erreur lors de la validation:', error);
      next(error);
    }
  };
}

/**
 * Formate les erreurs Zod dans un format plus lisible
 */
function formatZodErrors(error: z.ZodError) {
  return error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
}

/**
 * Gestionnaire d'erreurs de validation global
 */
export function validationErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Erreur de validation des données',
      errors: formatZodErrors(error),
    });
  }
  
  // Si ce n'est pas une erreur de validation, passer au prochain middleware d'erreur
  next(error);
}

/**
 * Middleware pour valider l'ID des paramètres de requête
 */
export const validateIdParam = validate(
  z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID invalide'),
  }),
  'params'
);
