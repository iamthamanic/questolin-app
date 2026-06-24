import { defineConfig, devices } from '@playwright/test';

const devUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3047';

export default defineConfig({
  testDir: '.',
  testMatch: ['e2e/**/*.spec.ts', '.qa/runs/**/*.spec.ts'],
  outputDir: '.qa/test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: devUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 390, height: 844 },
  },
  projects: [{ name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }],
  webServer: {
    command: 'npm run dev',
    url: devUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
