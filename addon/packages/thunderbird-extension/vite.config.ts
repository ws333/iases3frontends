import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteTsconfigPaths from "vite-tsconfig-paths";

const IFRAME_PATH = path.join(__dirname, "../thunderbird-iframe-service/dist/*");
const INTERFACE_PATH = path.join(__dirname, "../interface/dist/*");

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        viteTsconfigPaths(),
        viteStaticCopy({
            targets: [
                { src: IFRAME_PATH, dest: "content" },
                { src: INTERFACE_PATH, dest: "content/interface" },
            ],
        }),
    ],
    build: {
        sourcemap: false,
        minify: false,
        lib: {
            entry: "src/background.js",
            name: "background",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                entryFileNames: `content/[name].js`,
                chunkFileNames: `content/[name].js`,
                assetFileNames: `content/[name].[ext]`,
            },
        },
    },
});
