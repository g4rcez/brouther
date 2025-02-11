import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            external: ["r", "react/jsx-runtime"],
        },
    },
});
