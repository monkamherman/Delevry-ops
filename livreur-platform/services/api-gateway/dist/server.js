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
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const container_1 = require("./config/container");
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_1 = __importStar(require("./infrastructure/logging/logger"));
const morgan_1 = __importDefault(require("morgan"));
require("./controllers");
// Création du serveur
const server = new inversify_express_utils_1.InversifyExpressServer(container_1.container);
server.setConfig((app) => {
    // Configuration du middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Configuration des logs HTTP
    app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
    // Configuration des en-têtes CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    // Log des requêtes entrantes
    app.use((req, res, next) => {
        logger_1.default.info(`Requête reçue: ${req.method} ${req.path}`);
        next();
    });
});
const app = server.build();
exports.app = app;
// Gestion des erreurs
app.use(error_middleware_1.errorHandler);
// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Rejet non géré à la promesse:', { promise, reason });
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Exception non capturée:', { error });
    process.exit(1);
});
//# sourceMappingURL=server.js.map