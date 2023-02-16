/**
 * @type {import('ts-jest').JestConfigWithTsJest} config
 */
const config = {
  preset: 'ts-jest/presets/default-esm',
  resolver: 'ts-jest-resolver',
  clearMocks: true,
  collectCoverage: process.env.CI === 'true',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  coverageReporters:
    process.env.CI === 'true'
      ? [['cobertura', { file: `cobertura-coverage.xml` }]]
      : [],
  modulePaths: ['<rootDir>'],
  reporters: process.env.CI === 'true' ? ['default', 'jest-junit'] : undefined,
  resetMocks: true,
  restoreMocks: true,
  roots: ['src/', 'tests/'],
  testMatch: ['**/__tests__/**/*.spec.ts'],
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-env.js'],
  testEnvironment: 'jsdom',
}

export default config
