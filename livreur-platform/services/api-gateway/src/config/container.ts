import { Container } from "inversify";
import { TYPES } from "../constants/types";

// Import des contrôleurs
import "../controllers/delivery.controller";
import "../controllers/user.controller";

// Import des services
import { DeliveryService } from "../domain/services/delivery.service";
import { UserService } from "../domain/services/user.service";

// Import des repositories
import {
  IUserRepository,
  UserRepository,
} from "../domain/repositories/user.repository";

const container = new Container();

// Enregistrement des dépendances
container
  .bind<UserService>(TYPES.UserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<DeliveryService>(TYPES.DeliveryService)
  .to(DeliveryService)
  .inSingletonScope();
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();

export { container };
