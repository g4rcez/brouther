import { defineConfig } from "cypress";

export default defineConfig({
    video: false,
    screenshotsFolder: false,
    e2e: {
        baseUrl: "http://localhost:5173",
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
    },
});
