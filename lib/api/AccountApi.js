const GlobalVars = require('../GlobalVars');

/**
 * AccountApi - จัดการคำสั่งที่เกี่ยวกับบัญชี (ใช้ baseURL จาก GlobalVars)
 */
class AccountApi {
    constructor(request) {
        this.request = request;
        // ดึง Base URL ของ Account Service (พอร์ต 8081)
        this.baseUrl = GlobalVars.get('orch_deposit_saving_account_creation'); 
    }

    /**
     * API: สร้างบัญชีใหม่
     */
    async createAccount(headers, data) {
        return await this.request.post(`${this.baseUrl}/deposit/v1/account/create`, {
            headers: headers,
            data: data
        });
    }

    /**
     * API: ตรวจสอบข้อมูลบัญชี (Inquiry)
     */
    async inquiryAccount(headers, accountNo) {
        return await this.request.get(`${this.baseUrl}/deposit/v1/account/inquiry/${accountNo}`, {
            headers: headers
        });
    }
}

module.exports = AccountApi;
