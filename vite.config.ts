import { defineConfig } from "vite";

export default defineConfig({
    plugins: [],
    build: {
        emptyOutDir: false,
        sourcemap: true,
        outDir: "./dist",
        lib: {
            name: "brouther",
            entry: "./src/index.ts",
            fileName: "brouther",
            formats: ["cjs", "es", "umd"],
        },
        rollupOptions: {
            external: ["react/jsx-runtime", "react"],
        },
    },
});
