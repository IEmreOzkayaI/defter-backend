const COVERAGE_EXCLUDES = [
  '!src/**/*.module.ts',
  '!src/main.ts',
  '!src/**/*.dto.ts',
  '!src/**/*.entity.ts',

  // 🔴 infrastructure / shared
  '!src/common/**',
  '!src/modules/shared/**',

  // 🔴 test artefacts
  '!**/*.spec.ts',
  '!**/*.integration.spec.ts',
  '!**/*.test.ts',
  '!**/__tests__/**',
  '!test/**',
];

/** @type {import('jest').Config} */
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,

  testRegex: '.*\\.integration\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ts'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },

  maxWorkers: 1,
  testTimeout: 15000,
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  forceExit: true,
  detectOpenHandles: true,

  // 📁 unified structure
  coverageDirectory: './reports/coverage/integration',

  collectCoverageFrom: ['src/**/*.(t|j)s', ...COVERAGE_EXCLUDES],

  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/tests/integration',
        filename: 'report.html',
        pageTitle: 'TokenX | Integration Tests',
        expand: true,
        openReport: false,
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};
