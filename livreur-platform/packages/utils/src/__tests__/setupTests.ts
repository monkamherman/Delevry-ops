import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuration de testing-library
configure({
  testIdAttribute: 'data-test-id',
});

// Configuration des mocks globaux
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Configuration de Jest pour les tests asynchrones
jest.setTimeout(10000); // 10 secondes de timeout par défaut

// Fonctions utilitaires pour les tests
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      localStorage: {
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
        removeItem: (key: string) => void;
        clear: () => void;
      };
    }
  }
}
