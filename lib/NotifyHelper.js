const fs = require('fs');
const path = require('path');

/**
 * NotifyHelper - Utilities for sending notifications and files to Discord.
 */
class NotifyHelper {
    /**
     * Sends an embedded message and attaches a file to a Discord Webhook.
     * @param {string} message The description text.
     * @param {string} filePath Path to the file to be attached.
     * @param {string} status 'success' or 'failure' (determines the color).
     */
    static async sendToDiscordWithFile(message, filePath, status = "success") {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        const color = status === "success" ? 3066993 : 15158332; // Green or Red
        const icon = status === "success" ? "✅" : "❌";

        // Construct JSON Payload for Discord Embed
        const payload = {
            "embeds": [{
                "title": `${icon} API Test Summary`,
                "description": message,
                "color": color,
                "timestamp": new Date().toISOString()
            }]
        };

        // Log notification to console
        console.log('--- [Notify] 📢 Notification Triggered ---');
        console.log('Webhook configured:', !!webhookUrl);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        NotifyHelper.logNotificationToFile(payload, filePath, 'attempt');

        if (!webhookUrl) {
            console.warn('--- [Notify] ⚠️  DISCORD_WEBHOOK_URL is not configured, saving to log file instead ---');
            return;
        }

        const formData = new FormData();
        formData.append('payload_json', JSON.stringify(payload));

        if (filePath && fs.existsSync(filePath)) {
            try {
                const fileBuffer = fs.readFileSync(filePath);
                const fileName = path.basename(filePath);
                const blob = new Blob([fileBuffer], { type: 'text/html' });
                formData.append('file', blob, fileName);
                console.log(`--- [Notify] Attached HTML file: ${fileName} ---`);
            } catch (err) {
                console.warn('--- [Notify] Warning: failed to attach HTML file:', err.message);
            }
        }

        try {
            console.log('--- [Notify] Sending request to Discord with file attachment... ---');
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log(`--- [Notify] ✅ Success: Discord responded with ${response.status} ---`);
                NotifyHelper.logNotificationToFile(payload, filePath, 'sent');
            } else {
                const errorDetail = await response.text();
                console.warn(`--- [Notify] ⚠️  Discord API returned ${response.status}, falling back to log file ---`);
                console.warn(`--- [Notify] Response detail: ${errorDetail}`);
                NotifyHelper.logNotificationToFile(payload, filePath, 'failed');
            }
        } catch (err) {
            console.warn(`--- [Notify] ⚠️  Fetch failed (${err.message}), falling back to log file ---`);
            NotifyHelper.logNotificationToFile(payload, filePath, 'failed');
        }
    }

    static logNotificationToFile(payload, filePath, status = 'attempt') {
        try {
            const logPath = 'test-results/notification.log';
            const timestamp = new Date().toISOString();
            let logContent = `\n[${timestamp}] Notification (${status}):\n`;
            logContent += JSON.stringify(payload, null, 2) + '\n';
            
            if (filePath && fs.existsSync(filePath)) {
                logContent += `Report file: ${filePath}\n`;
            }

            // Ensure directory exists
            const dir = require('path').dirname(logPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.appendFileSync(logPath, logContent);
            console.log(`--- [Notify] 📝 Notification saved to ${logPath} ---`);
        } catch (err) {
            console.error(`--- [Notify] Error saving to log file: ${err.message} ---`);
        }
    }
}

module.exports = NotifyHelper;
