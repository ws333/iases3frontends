import react from "@vitejs/plugin-react";
import { createRequire } from "module";
import path from "node:path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import viteTsconfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);

const INTERFACE_PATH = path.join(require.resolve("@iases3/interface/index.html"), "../*");

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
        sourcemap: true,
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
