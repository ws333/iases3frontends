import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        projects: [
            "./packages/thunderbird-iframe-service/vite.config.ts",
            "./packages/iframe-service/vite.config.ts",
            "./packages/thunderbird-extension/vite.config.ts",
            "./packages/browser-preview/vite.config.ts",
            "./packages/interface/vite.config.ts",
        ],
    },
});
