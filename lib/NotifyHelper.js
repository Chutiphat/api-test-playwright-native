/**
 * NotifyHelper - ตัวช่วยส่งแจ้งเตือนไปยัง Slack
 */
class NotifyHelper {
    /**
     * ส่งข้อความไปยัง Slack Webhook
     * @param {string} message เนื้อหา
     * @param {string} status สถานะ (success, failure)
     */
    static async sendToSlack(message, status = "success") {
        const webhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
            console.warn("[Notify] Skipping Slack notification: SLACK_WEBHOOK_URL not found.");
            return;
        }

        const icon = status === "success" ? "✅" : "❌";
        
        const payload = {
            "text": `${icon} *API Test Result: ${status.toUpperCase()}*\n${message}`
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log("[Notify] Slack notification sent.");
        } catch (err) {
            console.error("[Notify] Failed to send Slack notification:", err.message);
        }
    }
}

module.exports = NotifyHelper;
