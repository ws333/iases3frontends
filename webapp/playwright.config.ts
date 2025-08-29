import { defineConfig } from '@playwright/test';

const outputFolder = 'playwright/report';

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.test.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder }]],
  use: {
    baseURL: 'http://localhost:5174/webapp',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  webServer: [
    {
      // Starting both webapp and docs dev server
      command: 'pnpm dev',
      url: 'http://localhost:5174/webapp',
      reuseExistingServer: !process.env.CI,
      timeout: 30 * 1000,
    },
  ],
});
