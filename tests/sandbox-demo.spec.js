const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');

/**
 * 💡 Sandbox Demo - สำหรับทดลองรันเพื่อดู Report และ Discord Notification
 * ไฟล์นี้ไม่ต้องใช้ Database หรือ AWS จริง
 */
test.describe('Comprehensive (Sandbox Demo)', () => {
    const utils = new Utils();

    test('Step 1: Simulate API Call', async ({ request }) => {
        // ลองยิงไปที่ API สาธารณะเพื่อดูผล Pass
        const response = await request.get('https://jsonplaceholder.typicode.com/todos/1');
        await utils.TestSuccess({ "id": 1, "completed": false }, response);
    });

    test('Step 2: Simulate Database Check (Mock)', async () => {
        await test.step('Check tbl_account in DB', async () => {
            console.log("[MOCK DB] Querying: SELECT * FROM tbl_account...");
            // จำลองว่าเช็กแล้วเจอข้อมูล
            const mockDbRow = { account_no: '12345', status: 'ACTIVE' };
            expect(mockDbRow.status).toBe('ACTIVE');
        });
    });

    test('Step 3: Simulate AWS Logs Search (Mock)', async () => {
        await test.step('Search CloudWatch for SUCCESS logs', async () => {
            console.log("[MOCK AWS] Searching logs for requestId: 7280b1fd...");
            // จำลองว่าเจอ Log
            const mockLog = "2026-04-03 10:00:00 - INFO - Process SUCCESS";
            expect(mockLog).toContain("SUCCESS");
        });
    });
});
