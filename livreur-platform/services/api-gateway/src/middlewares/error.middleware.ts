import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../infrastructure/logging/logger';
import { ValidationError } from 'class-validator';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log de l'erreur
  logger.error(`Erreur: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Gestion des erreurs de validation
  if (Array.isArray(error) && error[0] instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Erreur de validation',
      errors: error.map(err => ({
        property: err.property,
        constraints: err.constraints,
      })),
    });
  }

  // Gestion des erreurs personnalisées
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Erreur serveur par défaut
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Une erreur est survenue sur le serveur',
  });
}
