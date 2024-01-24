import type { Config } from 'jest';

const config: Config = {
  // preset: 'ts-jest',
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['.module.ts$', 'main.ts'],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  coverageReporters: [['text', { skipFull: true }], 'text-summary', 'clover', 'html', 'json'],
};

export default config;
