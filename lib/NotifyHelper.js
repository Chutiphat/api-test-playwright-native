const fs = require('fs');

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
        if (!webhookUrl) {
            console.error('--- [Notify] Error: DISCORD_WEBHOOK_URL is missing ---');
            return;
        }

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

        const formData = new FormData();
        formData.append('payload_json', JSON.stringify(payload));

        // Attach file if it exists
        if (filePath && fs.existsSync(filePath)) {
            try {
                const fileBuffer = fs.readFileSync(filePath);
                const blob = new Blob([fileBuffer], { type: 'text/html' });
                formData.append('file', blob, 'automation-report.html');
                console.log(`--- [Notify] File attached: ${filePath} (${fileBuffer.length} bytes) ---`);
            } catch (err) {
                console.error("--- [Notify] Error reading file:", err.message);
            }
        }

        try {
            console.log('--- [Notify] Sending request to Discord... ---');
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log(`--- [Notify] Success: Discord responded with ${response.status} ---`);
            } else {
                const errorDetail = await response.text();
                console.error(`--- [Notify] Discord API Error (${response.status}): ${errorDetail} ---`);
            }
        } catch (err) {
            console.error("--- [Notify] Fetch Exception:", err.message);
        }
    }
}

module.exports = NotifyHelper;
