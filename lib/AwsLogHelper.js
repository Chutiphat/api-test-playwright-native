const { CloudWatchLogsClient, FilterLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");

/**
 * AwsLogHelper - Utility for searching and retrieving logs from AWS CloudWatch.
 */
class AwsLogHelper {
    constructor() {
        this.client = new CloudWatchLogsClient({
            region: process.env.AWS_REGION || "ap-southeast-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }

    /**
     * Searches for logs containing specific patterns.
     * @param {string} logGroupName 
     * @param {string} filterPattern (e.g. 'ERROR', '{ $.status = "FAIL" }')
     * @param {number} startTime (Timestamp in ms)
     */
    async findLogs(logGroupName, filterPattern, startTime = Date.now() - 3600000) {
        try {
            console.log(`[AWS Logs] Searching in ${logGroupName} for pattern: ${filterPattern}`);
            const command = new FilterLogEventsCommand({
                logGroupName: logGroupName,
                filterPattern: filterPattern,
                startTime: startTime
            });
            const response = await this.client.send(command);
            return response.events || [];
        } catch (err) {
            console.error(`[AWS Logs] Error fetching logs:`, err.message);
            throw err;
        }
    }
}

module.exports = AwsLogHelper;
