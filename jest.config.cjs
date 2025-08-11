/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
};
