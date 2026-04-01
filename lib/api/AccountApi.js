const GlobalVars = require('../GlobalVars');

class AccountApi {
    constructor(request) {
        this.request = request;
        // ดึง Base URL โดยระบุชื่อเฉพาะเจาะจงตามที่ตั้งไว้ใน GlobalVars
        this.baseUrl = GlobalVars.get('orch_deposit_saving_account_creation'); 
    }

    async createAccount(headers, data) {
        return await this.request.post(`${this.baseUrl}/deposit/v1/account/create`, {
            headers: headers,
            data: data
        });
    }

    async inquiryAccount(headers, accountNo) {
        return await this.request.get(`${this.baseUrl}/deposit/v1/account/inquiry/${accountNo}`, {
            headers: headers
        });
    }
}

module.exports = AccountApi;
