import react from "@vitejs/plugin-react";
import path from "path";
// import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        viteTsconfigPaths(),
        // Bundle everything into a single file
        // This will make it easier to load files in the extension
        // viteSingleFile(),
    ],
    resolve: {
        alias: {
            "@lib/ui": path.resolve(__dirname, "../../node_modules/radzionkit/lib/ui"),
            "@lib/utils": path.resolve(__dirname, "../../node_modules/radzionkit/lib/utils"),
            "@lib/codegen": path.resolve(__dirname, "../../node_modules/radzionkit/lib/codegen"),
        },
    },
    build: {
        sourcemap: true,
        minify: true,
        rollupOptions: {
            maxParallelFileOps: 100,
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
});
