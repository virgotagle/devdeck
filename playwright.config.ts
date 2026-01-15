import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1, // Electron apps often have issues with parallel execution
  use: {
    trace: 'on-first-retry'
  }
})
