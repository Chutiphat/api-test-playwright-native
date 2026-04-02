const GlobalVars = require('../GlobalVars');

/**
 * BatchApi - จัดการคำสั่งที่เกี่ยวกับ Batch Jobs (อัปเดตตาม CURL จริง)
 */
class BatchApi {
    constructor(request) {
        this.request = request;
        // ดึง Base URL ของ Batch Service (พอร์ต 8085)
        this.baseUrl = GlobalVars.get('orch_deposit_batch_trigger'); 
    }

    /**
     * สั่งรัน Batch Job ผ่าน API
     * @param {object} headers ส่วนหัวของ Request (ที่ได้จาก TestHelper)
     * @param {object} data ข้อมูล Payload (name, triggerMode, etc.)
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
