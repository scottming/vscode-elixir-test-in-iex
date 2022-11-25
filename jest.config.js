/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ['src/test/', 'out/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};

module.exports = config;
