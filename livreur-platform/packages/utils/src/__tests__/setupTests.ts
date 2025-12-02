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
  key: jest.fn(),
  length: 0,
};

// Configuration de Jest pour les tests asynchrones
jest.setTimeout(10000); // 10 secondes de timeout par défaut

// Déclaration des types globaux
declare global {
  // eslint-disable-next-line no-var
  var localStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    key: (index: number) => string | null;
    length: number;
  };
}

// Assignation du mock à global.localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
