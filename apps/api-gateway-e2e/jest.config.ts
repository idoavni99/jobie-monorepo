export default {
  displayName: 'api-gateway-e2e',
  preset: '../../jest.preset.js',
  globalSetup: '<rootDir>/src/support/global-setup.e2e.ts',
  globalTeardown: '<rootDir>/src/support/global-teardown.e2e.ts',
  setupFiles: ['<rootDir>/src/support/test-setup.e2e.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/api-gateway-e2e',
};
