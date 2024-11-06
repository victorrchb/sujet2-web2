module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/__tests__/',
      '/config/'
    ],
    testTimeout: 30000,
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: [
      "**/__tests__/**/*.test.js"
    ]
  };