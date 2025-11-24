// Configuration de base pour les tests Jest
import { jest } from "@jest/globals";
import "jest-extended";

// Configuration des mocks globaux
jest.mock("axios");

// Configuration des variables d'environnement pour les tests
(global as any).process = { env: { NODE_ENV: "test" } };
