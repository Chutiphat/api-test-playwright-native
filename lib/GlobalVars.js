// 🚀 เรียกใช้ dotenv เพื่อให้ดึงค่าจากไฟล์ .env มาใช้งานได้ (สำหรับรัน Local)
require('dotenv').config();

/**
 * GlobalVars.js - แหล่งรวม URL และตัวแปรที่ดึงค่าได้ทั้งจาก .env และ Environment Variables (Jenkins)
 */
class GlobalVars {
    constructor() {
        this.vars = {
            // Priority: Jenkins (process.env) ➔ .env file ➔ Default Value
            orch_deposit_saving_account_creation: process.env.ACCOUNT_URL || 'http://127.0.0.1:8081',
            orch_deposit_restriction_creation: process.env.RESTRICTION_URL || 'http://127.0.0.1:8086',

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
