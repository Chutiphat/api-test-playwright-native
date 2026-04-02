const NotifyHelper = require('./NotifyHelper');
require('dotenv').config();

/**
 * Global Teardown - สรุปผลการทดสอบและส่งแจ้งเตือนเข้า Discord
 */
async function globalTeardown(config) {
    console.log('--- DEBUG: globalTeardown started ---');
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    console.log('--- DEBUG: DISCORD_WEBHOOK_URL length:', webhookUrl ? webhookUrl.length : 0);
    
    if (!webhookUrl) {
        console.log('--- DEBUG: SLACK_WEBHOOK_URL not found in process.env ---');
        return;
    }

    const isCI = !!process.env.CI;
    const reportUrl = isCI ? `${process.env.BUILD_URL}playwright-report/` : "Local Folder";
    
    const message = `**Run Location:** ${isCI ? "☁️ Jenkins CI" : "💻 Local Machine"}\n**Report:** ${reportUrl}`;
    
    console.log('--- DEBUG: Sending to Discord... ---');
    await NotifyHelper.sendToDiscord(message, "success");
    console.log('--- DEBUG: globalTeardown finished ---');
}

module.exports = globalTeardown;
