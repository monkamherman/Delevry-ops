import 'reflect-metadata';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cors from 'cors';
import { createClient } from 'redis';
import helmet from 'helmet';
import compression from 'compression';
import cacheControl from 'express-cache-controller';
import { errorHandler } from './middlewares/error.middleware';
import logger, { stream } from './infrastructure/logging/logger';
import { container } from './config/container';
import { InversifyExpressServer } from 'inversify-express-utils';
import './controllers'; // Import des contrôleurs pour l'enregistrement

// Création du client Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Gestion des erreurs Redis
redisClient.on('error', (err) => {
  logger.error('Erreur de connexion Redis:', err);
});

// Configuration CORS dynamique
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    logger.debug(`Origine reçue: ${origin}`);
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      logger.warn(`Requête CORS bloquée depuis l'origine: ${origin}`);
      callback(new Error('Non autorisé par la politique CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Création du serveur Inversify
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  // Middlewares critiques en premier
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Configuration de la sécurité
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  }));

  // Compression des réponses
  app.use(compression());

  // Cache control
  app.use(cacheControl({
    maxAge: 300,
    private: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Logging HTTP
  app.use(morgan('combined', { stream }));
  
  // Log des requêtes entrantes
  app.use((req, res, next) => {
    logger.info(`Requête reçue: ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });
});

// Construction de l'application Express
const app = server.build();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/keep-alive', (req, res) => res.send('OK'))

// Rate limiting (après les routes critiques)


app.use(async (req, res, next) => {
	const ip = req.ip;
	const key = `rate_limit:${ip}`;
	const limit = ONE_HUNDRED;
  
	const current = await redisClient.incr(key);
  
	if (current === 1) {
	  await redisClient.expire(key, SIXTY); // Expire après 60 secondes
	}
  
	if (current > limit) {
	  return res.status(429).json({ error: 'Trop de requêtes depuis cette adresse IP' });
	}
  
	next();
  });

app.use(compression())
app.use(cacheControl({ maxAge: 86400 }));
// Logging
app.use(morgan('combined', { stream: morganStream }));

app.use(express.static('public'));

// Route racine modifiée
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});


// Gestion des erreurs CORS
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message.includes('CORS')) {
    res.status(403).json({ error: err.message });
  } else {
    next(err);
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 10000;

// Ajoutez ce contrôle d'erreur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
  console.error('Erreur de démarrage:', err.message);
  process.exit(1);
});

