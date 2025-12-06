"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_cache_controller_1 = __importDefault(require("express-cache-controller"));
const logger_1 = __importStar(require("./infrastructure/logging/logger"));
const container_1 = require("./config/container");
const inversify_express_utils_1 = require("inversify-express-utils");
require("./controllers"); // Import des contrôleurs pour l'enregistrement
// Création du client Redis
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
// Gestion des erreurs Redis
redisClient.on('error', (err) => {
    logger_1.default.error('Erreur de connexion Redis:', err);
});
// Configuration CORS dynamique
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
const corsOptions = {
    origin: (origin, callback) => {
        logger_1.default.debug(`Origine reçue: ${origin}`);
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            logger_1.default.warn(`Requête CORS bloquée depuis l'origine: ${origin}`);
            callback(new Error('Non autorisé par la politique CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Création du serveur Inversify
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.container);
server.setConfig((app) => {
    // Middlewares critiques en premier
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Configuration de la sécurité
    app.use((0, helmet_1.default)({
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
    app.use((0, compression_1.default)());
    // Cache control
    app.use((0, express_cache_controller_1.default)({
        maxAge: 300,
        private: true,
    }));
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limite chaque IP à 100 requêtes par fenêtre
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    // Logging HTTP
    app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
    // Log des requêtes entrantes
    app.use((req, res, next) => {
        logger_1.default.info(`Requête reçue: ${req.method} ${req.path}`, {
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
app.get('/keep-alive', (req, res) => res.send('OK'));
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
app.use((0, compression_1.default)());
app.use((0, express_cache_controller_1.default)({ maxAge: 86400 }));
// Logging
app.use((0, morgan_1.default)('combined', { stream: morganStream }));
app.use(express_1.default.static('public'));
// Route racine modifiée
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});
// Gestion des erreurs CORS
app.use((err, req, res, next) => {
    if (err.message.includes('CORS')) {
        res.status(403).json({ error: err.message });
    }
    else {
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
//# sourceMappingURL=app.js.map