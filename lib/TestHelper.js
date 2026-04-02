const crypto = require('crypto');

/**
 * TestHelper - ตัวช่วยสร้างข้อมูลและ Header สำหรับการทดสอบ
 */
class TestHelper {
    /**
     * สร้าง UUID และ Trace Parent พื้นฐาน
     */
    static generateApiHeaders() {
        const guidValue = crypto.randomUUID();
        const requestId = `${guidValue}-reqid`;
        const tracePart = crypto.randomBytes(8).toString('hex');
        const traceParent = `00-dddddd1916cad43d8448eb211c80319c-${tracePart}-01`;
        
        return { requestId, traceParent };
    }

    /**
     * Template: Header สำหรับฝั่ง Ops Portal (ค่าเริ่มต้นส่วนใหญ่)
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
     * Template: Header สำหรับฝั่งแอปฯ เป๋าตัง (Paotang)
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
     * ดึงวันที่และเวลาปัจจุบันใน Format API
     */
    static getRequestDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0] + '+07:00'; // HH:mm:ss+07:00
        return { date, time };
    }
}

module.exports = TestHelper;
