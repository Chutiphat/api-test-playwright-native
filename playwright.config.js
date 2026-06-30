// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs');
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
  
  /* 📊 Reporting System */
  reporter: [
    // ❌ ปิดการเปิด Report อัตโนมัติของ Playwright เพื่อไม่ให้บัง Allure
    ['html', { open: 'never' }], 
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['monocart-reporter', {  
        name: "API Test Report",
        outputFile: './test-results/automation-report.html',
        onEnd: async (reportData) => {
            const reportPath = path.resolve(__dirname, 'test-results/automation-report.html');
            const rawBuildUrl = (process.env.BUILD_URL || process.env.JENKINS_URL || '').trim();
            const invalidBuildUrl = rawBuildUrl && /^(?:https?:\/\/)?(?:localhost|127(?:\.\d{1,3}){3})(?:[:\/]|$)/i.test(rawBuildUrl);
            const jenkinsBaseUrl = invalidBuildUrl ? '' : rawBuildUrl;
            const isRemoteJenkinsUrl = !!jenkinsBaseUrl;
            const isJenkins = isRemoteJenkinsUrl;
            const reportUrl = isRemoteJenkinsUrl
                ? `${jenkinsBaseUrl.replace(/\/+$/, '')}/allure/`
                : rawBuildUrl
                    ? "Invalid BUILD_URL, using fallback: Attached below"
                    : "Attached below";

            if (invalidBuildUrl) {
                console.warn(`--- [Report] ⚠️ Invalid BUILD_URL detected: ${rawBuildUrl}. Falling back to no remote report link.`);
            }

            const s = reportData.summary;
            const total = s.tests?.value ?? 0;
            const failed = s.failed?.value ?? 0;
            const passed = s.passed?.value ?? 0;
            const duration = (reportData.duration / 1000).toFixed(1);

            let failedDetails = '';
            const reportJsonPath = path.resolve(__dirname, 'test-results/automation-report.json');
            if (fs.existsSync(reportJsonPath)) {
                try {
                    const reportJson = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
                    const collectFailedCases = (node, results = []) => {
                        if (!node || typeof node !== 'object') return results;
                        if (node.type === 'case' && (node.caseType === 'failed' || node.status === 'failed' || node.outcome === 'unexpected')) {
                            const failureSteps = (node.subs || [])
                                .filter((step) => step?.type === 'step' && step?.stepType === 'expect')
                                .map((step) => step.title)
                                .filter(Boolean);
                            const details = failureSteps.length > 0
                                ? failureSteps.slice(0, 3).join(' • ')
                                : 'Assertion failed';
                            results.push(`${node.title} -> ${details}`);
                        }
                        if (Array.isArray(node.subs)) {
                            node.subs.forEach((child) => collectFailedCases(child, results));
                        }
                        if (Array.isArray(node.children)) {
                            node.children.forEach((child) => collectFailedCases(child, results));
                        }
                        return results;
                    };

                    const failureItems = collectFailedCases(reportJson.rows?.[0]);
                    if (failureItems.length > 0) {
                        failedDetails = `**Failed Cases:**\n${failureItems.map((item) => `- ${item}`).join('\n')}`;
                    }
                } catch (err) {
                    console.warn(`--- [Report] ⚠️ Could not parse automation report JSON: ${err.message}`);
                }
            }

            let table = "```\n";
            table += "┌─────────────┬──────────────────────┐\n";
            table += `│ Tests       │ ${total.toString().padEnd(20)} │\n`;
            table += `│ ├ Failed    │ ${failed.toString().padEnd(20)} │\n`;
            table += `│ └ Passed    │ ${passed.toString().padEnd(20)} │\n`;
            table += `│ Duration    │ ${(duration + "s").padEnd(20)} │\n`;
            table += "└─────────────┴──────────────────────┘\n";
            table += "```";

            const message = `**Run Location:** ${isJenkins ? "☁️ Jenkins CI" : "💻 Local Machine"}\n**Online Report:** ${reportUrl}${failedDetails ? `\n\n${failedDetails}` : ''}\n\n${table}`;
            const status = failed > 0 ? "failure" : "success";

            await new Promise(r => setTimeout(r, 2000));
            await NotifyHelper.sendToDiscordWithFile(message, reportPath, status);
        }
    }]
  ],

  timeout: 60000,
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
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
    },
  ],
});
