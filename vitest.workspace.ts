import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/thunderbird-iframe-service/vite.config.ts",
  "./packages/iframe-service/vite.config.ts",
  "./packages/thunderbird-extension/vite.config.ts",
  "./packages/browser-preview/vite.config.ts",
  "./packages/interface/vite.config.ts"
])
