import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'angular-spa',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4001',
      },
    },
    {
      name: 'react-spa',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4002',
      },
    },
    {
      name: 'vue-spa',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4003',
      },
    },
    {
      name: 'nextjs-app',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4004',
      },
    },
    {
      name: 'hono-app',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4005',
      },
    },
  ],
})
