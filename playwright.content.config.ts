import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/content',
  outputDir: 'test-results-content',
  workers: 1,
  use: {
    baseURL: 'http://localhost:3001',
    reducedMotion: 'reduce',
    launchOptions:
      process.platform === 'win32'
        ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' }
        : {},
  },
  webServer: {
    command: 'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3001',
    url: 'http://localhost:3001',
    timeout: 60000,
  },
});
