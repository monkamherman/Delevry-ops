import type { Config } from '@jest/types';

// Configuration pour charger les types globaux
const config: Config.InitialOptions = {
  // Configuration des types globaux
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // Configuration des fichiers de setup
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@livreur/core-types/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
