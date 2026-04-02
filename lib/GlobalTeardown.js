const NotifyHelper = require('./NotifyHelper');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Global Teardown - สรุปผลการทดสอบแบบละเอียดและแจ้งเตือน Discord
 */
async function globalTeardown(config) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const summaryPath = path.join(__dirname, '../test-results/summary.json');
    
    // ตรวจสอบว่าไฟล์สรุปผลถูกสร้างขึ้นไหม
    if (!fs.existsSync(summaryPath)) {
        console.warn('[Teardown] summary.json not found. Sending basic notification.');
        await NotifyHelper.sendToDiscord("การทดสอบเสร็จสิ้น (ไม่พบไฟล์สรุปผล)", "success");
        return;
    }

    try {
        const rawData = fs.readFileSync(summaryPath);
        const report = JSON.parse(rawData);

        // 📊 สรุปตัวเลข
        const total = report.suites.reduce((acc, suite) => acc + countTests(suite), 0);
        const passed = report.stats?.expected || 0;
        const failed = (report.stats?.unexpected || 0) + (report.stats?.flaky || 0);
        const skipped = report.stats?.skipped || 0;

        // 📝 รายชื่อ Test Cases
        const testList = [];
        report.suites.forEach(suite => extractTestNames(suite, testList));

        const status = failed > 0 ? "failure" : "success";
        const isCI = !!process.env.CI;
        const reportUrl = isCI ? `${process.env.BUILD_URL}playwright-report/` : "Check local `playwright-report` folder";

        // 🛠️ สร้างข้อความ Discord
        let description = `**Run Location:** ${isCI ? "☁️ Jenkins CI" : "💻 Local Machine"}\n`;
        description += `**Summary:** Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed} | ⏩ Skipped: ${skipped}\n\n`;
        description += `**Test Cases:**\n${testList.map(name => `- ${name}`).join('\n')}\n\n`;
        description += `**Report:** [Click Here](${reportUrl})`;

        await NotifyHelper.sendToDiscord(description, status);

    } catch (err) {
        console.error('[Teardown] Error processing summary.json:', err);
        await NotifyHelper.sendToDiscord("เกิดข้อผิดพลาดในการประมวลผลผลลัพธ์", "failure");
    }
}

/**
 * Helper: นับจำนวนเทสทั้งหมด
 */
function countTests(suite) {
    let count = suite.specs?.length || 0;
    if (suite.suites) {
        suite.suites.forEach(s => count += countTests(s));
    }
    return count;
}

/**
 * Helper: ดึงชื่อเทสทั้งหมด
 */
function extractTestNames(suite, list) {
    if (suite.specs) {
        suite.specs.forEach(spec => {
            const statusIcon = spec.ok ? "✅" : "❌";
            list.push(`${statusIcon} ${spec.title}`);
        });
    }
    if (suite.suites) {
        suite.suites.forEach(s => extractTestNames(s, list));
    }
}

module.exports = globalTeardown;
