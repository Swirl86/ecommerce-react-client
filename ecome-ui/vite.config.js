import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { alias } from "./alias.js";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    resolve: {
        alias,
    },

    test: {
        environment: "jsdom",
        setupFiles: "./src/setupTests.js",
        globals: true,
        alias,
    },
});
