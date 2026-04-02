// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /* 🏁 Global Teardown: รันหลังจบเทสทั้งหมด */
  globalTeardown: require.resolve('./lib/GlobalTeardown'),

  timeout: 60000,
  expect: { timeout: 10000 },
  
  use: {
    /* 🔑 extraHTTPHeaders: ใส่ Header พื้นฐานที่จะถูกส่งไปในทุก Request */
    extraHTTPHeaders: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-devops-key': 'z6JBqLeoa2KZBSciDAnBRb4Cq6n8tK95',
      // เพิ่มค่าเริ่มต้นที่คุณต้องการใช้ในเกือบทุก Scene
      'x-devops-src': 'ops-portal',
      'x-devops-dest': 'ops-portal',
    },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api-tests',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
