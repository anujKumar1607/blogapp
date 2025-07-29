module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testTimeout: 30000,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/'
  ],
  //setupFilesAfterEnv: ['./tests/setup.js']
};