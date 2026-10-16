import { defineConfig, devices } from '@playwright/test';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
export default defineConfig({
  testDir: './tests',
  testIgnore: '**/content/**',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL,
    launchOptions:
      process.platform === 'win32'
        ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
        : {},
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: `npm run start -- --port ${Number(new URL(baseURL).port) || 3000}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
