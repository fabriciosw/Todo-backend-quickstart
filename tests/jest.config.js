const { resolve } = require('path');

const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  name: 'e2e',
  displayName: 'e2e-tests',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: ['<rootDir>/**/*.test.ts'],
};
