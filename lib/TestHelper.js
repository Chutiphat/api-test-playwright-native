const crypto = require('crypto');

/**
 * TestHelper - Utility class for generating dynamic test data and headers.
 */
class TestHelper {
    /**
     * Generates a unique requestId and TraceParent.
     * Mimics uuidgen and openssl rand -hex 8.
     */
    static generateApiHeaders() {
        const guidValue = crypto.randomUUID();
        const requestId = `${guidValue}-reqid`;
        const tracePart = crypto.randomBytes(8).toString('hex');
        const traceParent = `00-dddddd1916cad43d8448eb211c80319c-${tracePart}-01`;
        
        return { requestId, traceParent };
    }

    /**
     * Header Template: Ops Portal (Default source)
     */
    static getOpsHeaders(requestId, traceParent) {
        return {
            'x-request-id': requestId,
            'x-traceparent': traceParent,
            'x-devops-src': 'ops-portal',
            'x-devops-dest': 'ops-portal'
        };
    }

    /**
     * Header Template: Paotang App
     */
    static getPaotangHeaders(requestId, traceParent) {
        return {
            'x-request-id': requestId,
            'x-traceparent': traceParent,
            'x-devops-src': 'paotang',
            'x-devops-dest': 'ktb-ddp'
        };
    }

    /**
     * Returns current date and time in API-compatible format.
     */
    static getRequestDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0] + '+07:00'; // HH:mm:ss+07:00
        return { date, time };
    }
}

module.exports = TestHelper;
