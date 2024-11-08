module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['cross-fetch/polyfill'], // Charge cross-fetch avant les tests
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/mocks/fileMock.js',
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
};
require('dotenv').config();
