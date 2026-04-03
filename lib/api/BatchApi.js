const GlobalVars = require('../GlobalVars');

/**
 * BatchApi - Methods for triggering and managing Batch Jobs.
 */
class BatchApi {
    constructor(request) {
        this.request = request;
        // Retrieve Batch Service URL (Port 8085)
        this.baseUrl = GlobalVars.get('orch_deposit_batch_trigger'); 
    }

    /**
     * Trigger a Batch Job via REST API
     * @param {object} headers Request headers (requestId, traceparent, etc.)
     * @param {object} data Job payload (name, triggerMode, additionalInfo)
     */
    async triggerBatch(headers, data) {
        console.log(`[API] Triggering Batch Job: ${data.name}`);
        return await this.request.post(`${this.baseUrl}/deposit/v1/batch/create`, {
            headers: headers,
            data: data
        });
    }
}

module.exports = BatchApi;
