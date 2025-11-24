/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // Configuration de la connexion à la base de données via l'URL d'environnement
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;
