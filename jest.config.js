module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/__tests__/__data__/global.js"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/__tests__/__data__/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};
