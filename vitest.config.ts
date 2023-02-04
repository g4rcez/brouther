import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        root: "./tests",
        dir: "./tests",
        globals: true,
    },
});
