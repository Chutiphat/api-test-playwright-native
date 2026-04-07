const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');

test.describe('E2E Scene: Account Lifecycle (Mock Mode)', () => {
    const utils = new Utils();

    test('Case: เปิดบัญชีสำเร็จและตรวจสอบข้อมูลได้', async () => {
        // --- STEP 1: CREATE ACCOUNT (MOCK) ---
        await test.step('1. Create Account API', async () => {
            console.log("[MOCK] POST /deposit/v1/account/create");
            const mockResponse = {
                status: () => 200,
                json: async () => ({ "responseCode": "0000", "accountNo": "100012345" })
            };
            
            await utils.TestSuccess({ "responseCode": "0000" }, mockResponse);
        });

        // --- STEP 2: INQUIRY ACCOUNT (MOCK) ---
        await test.step('2. Inquiry Account', async () => {
            console.log("[MOCK] GET /deposit/v1/account/inquiry/100012345");
            const mockResponse = {
                status: () => 200,
                json: async () => ({ "accountNo": "100012345", "accountStatus": "ACTIVE" })
            };
            
            await utils.TestSuccess({ "accountStatus": "ACTIVE" }, mockResponse);
        });
    });
});
