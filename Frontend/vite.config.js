import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@assets": path.resolve(__dirname, "src/assets"),
            "@components": path.resolve(__dirname, "src/components"),
            "@features": path.resolve(__dirname, "src/features"),
            "@hook-form": path.resolve(__dirname, "src/hook-form"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@layouts": path.resolve(__dirname, "src/layouts"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@redux": path.resolve(__dirname, "src/redux"),
            "@routes": path.resolve(__dirname, "src/routes"),
            "@theme": path.resolve(__dirname, "src/theme"),
            "@utils": path.resolve(__dirname, "src/utils"),
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
});
