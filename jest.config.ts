import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    roots: ["<rootDir>/src"],

    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
    },

    moduleFileExtensions: ["ts", "js", "json"],

    testMatch: ["**/test/**/*.spec.ts"],
};

export default config;
