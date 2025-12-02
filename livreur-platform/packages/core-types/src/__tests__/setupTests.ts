// Configuration de l'environnement de test
import 'jest';

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';

// Configuration des timeouts globaux
jest.setTimeout(10000); // 10 secondes de timeout par défaut

// Configuration des mocks globaux
// Exemple :
// jest.mock('some-module', () => ({
//   someFunction: jest.fn(),
// }));

// Configuration avant/après les tests
afterAll(async () => {
  // Nettoyage après tous les tests
});

beforeEach(() => {
  // Configuration avant chaque test
  jest.clearAllMocks();
});
