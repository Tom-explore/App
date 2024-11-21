module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["cross-fetch/polyfill"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Utilise Babel pour transformer
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-router|@ionic|@stencil|ionicons|lodash-es))" // Inclut les modules nécessaires
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/tests/mocks/fileMock.js"
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"]
};
