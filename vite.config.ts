import {defineConfig} from "vite";

export default defineConfig({
    plugins: [],
    build: {
        sourcemap: true,
        outDir: "./dist",
        emptyOutDir: false,
        lib: {
            name: "r",
            entry: "./src/index.ts",
            fileName: "index",
            formats: ["cjs", "es", "umd"],
        },
        rollupOptions: {
            treeshake: true,
            external: ["react/jsx-runtime", "react", "react/jsx-dev-runtime"],
        },
    },
});
