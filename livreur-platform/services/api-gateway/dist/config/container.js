"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../constants/types");
// Import des contrôleurs
require("../controllers/delivery.controller");
require("../controllers/user.controller");
// Import des services
const delivery_service_1 = require("../domain/services/delivery.service");
const user_service_1 = require("../domain/services/user.service");
// Import des repositories
const user_repository_1 = require("../domain/repositories/user.repository");
const container = new inversify_1.Container();
exports.container = container;
// Enregistrement des dépendances
container
    .bind(types_1.TYPES.UserService)
    .to(user_service_1.UserService)
    .inSingletonScope();
container
    .bind(types_1.TYPES.DeliveryService)
    .to(delivery_service_1.DeliveryService)
    .inSingletonScope();
container
    .bind(types_1.TYPES.UserRepository)
    .to(user_repository_1.UserRepository)
    .inSingletonScope();
//# sourceMappingURL=container.js.map