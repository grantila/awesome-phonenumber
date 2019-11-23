
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/test/**/*.js",
    "<rootDir>/test/**/*.ts",
  ],
  modulePathIgnorePatterns: [
    ".*\.d\.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/lib/*.js*"],
  coverageReporters: ["lcov", "text", "html"],
  maxConcurrency: Infinity,
};
