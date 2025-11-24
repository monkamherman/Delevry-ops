import mongoose from 'mongoose';
import { createClient } from 'redis';
import logger from '../infrastructure/logging/logger';

// Configuration de la connexion MongoDB
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/livreur-platform';
    await mongoose.connect(mongoUri);
    logger.info('Connecté à MongoDB avec succès');
  } catch (error) {
    logger.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Configuration du client Redis
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Erreur Redis:', err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Connecté à Redis avec succès');
  } catch (error) {
    logger.error('Erreur de connexion à Redis:', error);
    process.exit(1);
  }
};
