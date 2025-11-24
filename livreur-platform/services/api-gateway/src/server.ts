import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './config/container';
import { errorHandler } from './middlewares/error.middleware';
import logger, { stream } from './infrastructure/logging/logger';
import morgan from 'morgan';
import './controllers';

// Création du serveur
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  // Configuration du middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Configuration des logs HTTP
  app.use(morgan('combined', { stream }));
  
  // Configuration des en-têtes CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
  
  // Log des requêtes entrantes
  app.use((req, res, next) => {
    logger.info(`Requête reçue: ${req.method} ${req.path}`);
    next();
  });
});

const app = server.build();

// Gestion des erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejet non géré à la promesse:', { promise, reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Exception non capturée:', { error });
  process.exit(1);
});

export { app };
