// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const NotifyHelper = require('./lib/NotifyHelper');

require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['monocart-reporter', {  
        name: "API Test Report",
        outputFile: './test-results/automation-report.html',
        onEnd: async (reportData) => {
            const reportPath = path.resolve(__dirname, 'test-results/automation-report.html');
            const isCI = !!process.env.CI;
            const reportUrl = isCI ? `${process.env.BUILD_URL}playwright-report/` : "Attached below";
            
            // 📊 ดึงสถิติจากโครงสร้างจริง (ใช้ .value)
            const s = reportData.summary;
            const total = s.tests?.value ?? 0;
            const failed = s.failed?.value ?? 0;
            const flaky = s.flaky?.value ?? 0;
            const skipped = s.skipped?.value ?? 0;
            const passed = s.passed?.value ?? 0;
            const duration = (reportData.duration / 1000).toFixed(1);
            
            let table = "```\n";
            table += "┌─────────────┬──────────────────────┐\n";
            table += `│ Tests       │ ${total.toString().padEnd(20)} │\n`;
            table += `│ ├ Failed    │ ${failed.toString().padEnd(20)} │\n`;
            table += `│ ├ Flaky     │ ${flaky.toString().padEnd(20)} │\n`;
            table += `│ ├ Skipped   │ ${skipped.toString().padEnd(20)} │\n`;
            table += `│ └ Passed    │ ${passed.toString().padEnd(20)} │\n`;
            table += `│ Duration    │ ${(duration + "s").padEnd(20)} │\n`;
            table += "└─────────────┴──────────────────────┘\n";
            table += "```";

            const message = `**Run Location:** ${isCI ? "☁️ Jenkins CI" : "💻 Local Machine"}\n**Online Report:** ${reportUrl}\n\n${table}`;
            const status = failed > 0 ? "failure" : "success";
            
            await NotifyHelper.sendToDiscordWithFile(message, reportPath, status);
        }
    }]
  ],

  timeout: 60000,
  expect: { timeout: 10000 },
  
  use: {
    extraHTTPHeaders: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-devops-key': process.env.DEVOPS_KEY || 'xxxxxxxxxxx',
      'x-devops-src': 'xxxxxx',
      'x-devops-dest': 'xxxxxx',
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
