import react from "@vitejs/plugin-react-swc";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ["r"]
    },
    build: {
        rollupOptions: {
            external: ["r", "react/jsx-runtime"],
        }
    }
});
