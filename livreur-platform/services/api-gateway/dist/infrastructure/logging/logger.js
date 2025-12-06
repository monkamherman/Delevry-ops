"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, align } = winston_1.default.format;
// Création du format de log personnalisé
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
});
// Configuration des transports
const transports = {
    console: new winston_1.default.transports.Console({
        level: 'debug',
        format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align(), logFormat),
    }),
    file: new winston_1.default.transports.DailyRotateFile({
        filename: path_1.default.join(__dirname, '../../../logs/application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),
    errorFile: new winston_1.default.transports.DailyRotateFile({
        filename: path_1.default.join(__dirname, '../../../logs/error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
    }),
};
// Création du logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'delivery-ops-api' },
    transports: [
        transports.console,
        transports.file,
        transports.errorFile,
    ],
    exitOnError: false,
});
// Pour les environnements hors production, afficher les logs dans la console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
}
// Stream pour les logs de morgan
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map