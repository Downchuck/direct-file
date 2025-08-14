module.exports = {
  preset: '/app/node_modules/ts-jest/jest-preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: [
    "<rootDir>/packages/factgraph/src"
  ],
  modulePaths: [
    "<rootDir>/packages/factgraph/src"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
