// 🚀 Initialize dotenv to load values from .env file (for Local runs)
require('dotenv').config();

/**
 * GlobalVars - Central repository for URLs and variables shared across APIs.
 * Supports both Local (.env) and CI/CD (Jenkins environment variables).
 */
class GlobalVars {
    constructor() {
        this.vars = {
            // --- 🌐 Base URLs by Service ---
            // Priority: Jenkins (process.env) ➔ .env file ➔ Default Local Value
            orch_deposit_saving_account_creation: process.env.ACCOUNT_URL || 'http://127.0.0.1:8081',
            orch_deposit_restriction_creation: process.env.RESTRICTION_URL || 'http://127.0.0.1:8086',
            orch_deposit_batch_trigger: process.env.BATCH_URL || 'http://127.0.0.1:8085',

            // --- 🔑 Global Config ---
            API_ClientId: process.env.API_CLIENT_ID || 'CLIENT_001',
            API_ClientSecret: process.env.API_CLIENT_SECRET || 'SEC_999'
        };
    }

    /**
     * Set a global variable
     * @param {string} key 
     * @param {any} value 
     */
    set(key, value) {
        this.vars[key] = value;
    }

    /**
     * Get a global variable
     * @param {string} key 
     * @returns {any}
     */
    get(key) {
        return this.vars[key];
    }
}

// Export as Singleton to ensure all test files share the same instance
module.exports = new GlobalVars();
