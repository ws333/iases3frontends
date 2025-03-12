import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "node:path";

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
