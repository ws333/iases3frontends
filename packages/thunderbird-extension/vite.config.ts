import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "node:path";

const IFRAME_PATH = path.join(
    require.resolve("@iases3/thunderbird-iframe-service/thunderbird-iframe-server.html"),
    "../*"
);
const INTERFACE_PATH = path.join(require.resolve("@iases3/interface/index.html"), "../*");

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
