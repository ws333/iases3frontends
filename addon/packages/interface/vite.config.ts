import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [react(), viteTsconfigPaths()],
    resolve: {
        alias: {
            "@lib/ui": path.resolve(__dirname, "../../node_modules/ui-kit/lib/ui"),
            "@lib/utils": path.resolve(__dirname, "../../node_modules/ui-kit/lib/utils"),
            "@lib/codegen": path.resolve(__dirname, "../../node_modules/ui-kit/lib/codegen"),
        },
    },
    build: {
        target: "ES2022",
        sourcemap: false,
        minify: true,
        rollupOptions: {
            maxParallelFileOps: 100,
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
        chunkSizeWarningLimit: 2048,
    },
});
