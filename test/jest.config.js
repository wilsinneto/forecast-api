// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");
const root = resolve(__dirname, "..");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    rootDir: root,
    displayName: {
      name: "end2end-tests",
      color: "white",
    },
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"],
    testMatch: ["<rootDir>/test/**/*.test.ts"],
  },
};
