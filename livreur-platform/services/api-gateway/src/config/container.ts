import { Container } from 'inversify';
import { TYPES } from '../constants/types';

// Import des contrôleurs
import '../controllers/user.controller';

// Import des services
import { UserService } from '../domain/services/user.service';

// Import des repositories
import { IUserRepository, UserRepository } from '../domain/repositories/user.repository';

const container = new Container();

// Enregistrement des dépendances
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

export { container };
