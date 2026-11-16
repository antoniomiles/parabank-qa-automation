import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: !!process.env.CI,
  timeout: 45_000,
  globalTimeout: 600_000,
  expect: { timeout: 10_000 },
  outputDir: 'reports/latest/artifacts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/latest/html', open: 'never' }],
    ['json', { outputFile: 'reports/latest/results.json' }],
    ['junit', { outputFile: 'reports/latest/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'api', testMatch: '**/api/*.spec.ts' },
    { name: 'chromium', testMatch: '**/web/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
  ],
});
