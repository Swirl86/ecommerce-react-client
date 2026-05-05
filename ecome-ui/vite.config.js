import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@typography": path.resolve(__dirname, "./src/components/typography"),
            "@sidebar": path.resolve(__dirname, "./src/components/sidebar"),
            "@layout": path.resolve(__dirname, "./src/components/layout"),
            "@products": path.resolve(__dirname, "./src/components/products"),
            "@ui": path.resolve(__dirname, "./src/components/ui"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@context": path.resolve(__dirname, "./src/context"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@config": path.resolve(__dirname, "./src/config"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
        globals: true,
    },
});
