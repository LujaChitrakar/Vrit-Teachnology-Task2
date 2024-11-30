import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default config;
