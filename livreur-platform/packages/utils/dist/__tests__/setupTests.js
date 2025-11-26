"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const react_1 = require("@testing-library/react");
// Configuration de testing-library
(0, react_1.configure)({
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
// Assignation du mock à global.localStorage
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
});
