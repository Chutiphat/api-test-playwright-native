require('dotenv').config();

class GlobalVars {
    constructor() {
        this.vars = {
            // --- 🌐 Base URL แยกตาม Service ---
            orch_deposit_saving_account_creation: process.env.ACCOUNT_URL || 'http://127.0.0.1:8081',
            orch_deposit_restriction_creation: process.env.RESTRICTION_URL || 'http://127.0.0.1:8086',
            orch_deposit_batch_trigger: process.env.BATCH_URL || 'http://127.0.0.1:8085', // ⬅️ เพิ่มพอร์ต 8085

            // --- 🔑 Global Config ---
            API_ClientId: process.env.API_CLIENT_ID || 'CLIENT_001',
            API_ClientSecret: process.env.API_CLIENT_SECRET || 'SEC_999'
        };
    }

    set(key, value) {
        this.vars[key] = value;
    }

    get(key) {
        return this.vars[key];
    }
}

module.exports = new GlobalVars();
