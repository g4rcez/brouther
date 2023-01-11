import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        nodeVersion: "system",
        baseUrl: "http://localhost:5173",
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
    },
});
