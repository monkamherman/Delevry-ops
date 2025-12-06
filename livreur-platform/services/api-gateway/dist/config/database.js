"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("redis");
const logger_1 = __importDefault(require("../infrastructure/logging/logger"));
// Configuration de la connexion MongoDB
const connectMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/livreur-platform';
        await mongoose_1.default.connect(mongoUri);
        logger_1.default.info('Connecté à MongoDB avec succès');
    }
    catch (error) {
        logger_1.default.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};
exports.connectMongoDB = connectMongoDB;
// Configuration du client Redis
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
exports.redisClient.on('error', (err) => {
    logger_1.default.error('Erreur Redis:', err);
});
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        logger_1.default.info('Connecté à Redis avec succès');
    }
    catch (error) {
        logger_1.default.error('Erreur de connexion à Redis:', error);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
//# sourceMappingURL=database.js.map