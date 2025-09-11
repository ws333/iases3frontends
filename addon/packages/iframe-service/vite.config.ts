import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        dts({
            include: ["src"],
        }),
    ],
    build: {
        sourcemap: true,
        minify: false,
        lib: {
            entry: "src/iframe-service.ts",
            name: "iframeService",
            formats: ["es"],
        },
    },
});
