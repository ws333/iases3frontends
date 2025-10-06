import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteTsconfigPaths from "vite-tsconfig-paths";

const INTERFACE_PATH = path.resolve(__dirname, "../interface/*");

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        viteTsconfigPaths(),
        viteStaticCopy({
            targets: [{ src: INTERFACE_PATH, dest: "interface" }],
        }),
    ],
    build: {
        sourcemap: false,
        minify: true,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
});
