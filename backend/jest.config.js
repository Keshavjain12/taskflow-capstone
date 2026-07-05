/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/docs/**"],
  coverageThreshold: {
    global: { lines: 70 },
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testTimeout: 15000,
};
