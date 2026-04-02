const fs = require('fs');

/**
 * NotifyHelper - ตัวช่วยส่งแจ้งเตือนและไฟล์ไปยัง Discord
 */
class NotifyHelper {
    static async sendToDiscordWithFile(message, filePath, status = "success") {
        console.log('--- [Notify] Start sending to Discord ---');
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error('--- [Notify] Error: DISCORD_WEBHOOK_URL is missing ---');
            return;
        }

        const color = status === "success" ? 3066993 : 15158332;
        const icon = status === "success" ? "✅" : "❌";

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

        if (filePath && fs.existsSync(filePath)) {
            try {
                const fileBuffer = fs.readFileSync(filePath);
                const blob = new Blob([fileBuffer], { type: 'text/html' });
                // ใช้ชื่อคีย์ 'file' ซึ่งเป็นค่ามาตรฐานของ Discord
                formData.append('file', blob, 'automation-report.html');
                console.log(`--- [Notify] File attached: ${filePath} (${fileBuffer.length} bytes) ---`);
            } catch (err) {
                console.error("--- [Notify] Error reading file:", err.message);
            }
        }

        try {
            console.log('--- [Notify] Performing fetch request... ---');
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
            console.error("--- [Notify] Fetch Exception:", err);
        }
        console.log('--- [Notify] Process finished ---');
    }
}

module.exports = NotifyHelper;
