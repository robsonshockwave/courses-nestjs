export default {
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  detectOpenHandles: true,
  forceExit: true,
  setupFiles: ['dotenv/config'],
};
