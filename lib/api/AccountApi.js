const GlobalVars = require('../GlobalVars');

/**
 * AccountApi - Logic for handling account-related API calls.
 */
class AccountApi {
    constructor(request) {
        this.request = request;
        // Retrieve Base URL from GlobalVars (mapped to specific orchestration)
        this.baseUrl = GlobalVars.get('orch_deposit_saving_account_creation'); 
    }

    /**
     * API: Create a new account
     */
    async createAccount(headers, data) {
        return await this.request.post(`${this.baseUrl}/deposit/v1/account/create`, {
            headers: headers,
            data: data
        });
    }

    /**
     * API: Inquiry account details
     */
    async inquiryAccount(headers, accountNo) {
        return await this.request.get(`${this.baseUrl}/deposit/v1/account/inquiry/${accountNo}`, {
            headers: headers
        });
    }
}

module.exports = AccountApi;
