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

  /* ⏱️ Timeout Settings: ปรับให้เหมาะกับ API Testing */
  timeout: 60000, // 60 วินาทีสำหรับแต่ละ Test Case
  expect: {
    timeout: 10000, // 10 วินาทีสำหรับการเช็ก Assertion
  },
  
  use: {
    /* 🌐 baseURL: เราเอาออกเพราะแต่ละ API จะมี baseURL ของตัวเองใน GlobalVars */
    // baseURL: 'http://127.0.0.1:8081',

    /* 🔑 extraHTTPHeaders: ใส่เฉพาะ Header ที่ "ทุก API" ต้องมีเหมือนกัน */
    extraHTTPHeaders: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-devops-key': 'z6JBqLeoa2KZBSciDAnBRb4Cq6n8tK95',
    },
    
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api-tests', // เปลี่ยนชื่อโปรเจคให้เหมาะสมกับงาน API
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
