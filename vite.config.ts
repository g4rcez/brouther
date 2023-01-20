import { resolve } from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
    plugins: [dtsPlugin()],
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
