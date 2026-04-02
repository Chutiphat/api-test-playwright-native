/**
 * NotifyHelper - ตัวช่วยส่งแจ้งเตือนไปยัง Discord
 */
class NotifyHelper {
    /**
     * ส่งข้อความไปยัง Discord Webhook
     * @param {string} message เนื้อหา
     * @param {string} status สถานะ (success, failure)
     */
    static async sendToDiscord(message, status = "success") {
        console.log('--- DEBUG: NotifyHelper.sendToDiscord started ---');
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("[Notify] Skipping Discord notification: DISCORD_WEBHOOK_URL not found.");
            return;
        }

        const color = status === "success" ? 3066993 : 15158332; // เขียว หรือ แดง (Decimal Color)
        const icon = status === "success" ? "✅" : "❌";
        
        const payload = {
            "embeds": [{
                "title": `${icon} API Test Result: ${status.toUpperCase()}`,
                "description": message,
                "color": color,
                "timestamp": new Date().toISOString()
            }]
        };

        try {
            console.log('--- DEBUG: Performing fetch to Discord... ---');
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log('--- DEBUG: Discord response status:', response.status);
            if (response.ok) {
                console.log("[Notify] Discord notification sent.");
            } else {
                const errorText = await response.text();
                console.error("[Notify] Discord error response:", errorText);
            }
        } catch (err) {
            console.error("[Notify] Failed to send Discord notification:", err);
        }
        console.log('--- DEBUG: NotifyHelper.sendToDiscord finished ---');
    }
}

module.exports = NotifyHelper;
