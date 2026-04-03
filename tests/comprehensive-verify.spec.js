const { test, expect } = require('@playwright/test');
const DbHelper = require('../lib/DbHelper');
const AwsLogHelper = require('../lib/AwsLogHelper');
const TestHelper = require('../lib/TestHelper');

test.describe('Comprehensive Verification (DB & AWS Logs)', () => {
    let db;
    const awsLogs = new AwsLogHelper();

    test.beforeAll(async () => {
        db = new DbHelper();
    });

    test.afterAll(async () => {
        await db.close();
    });

    test('Should verify data in Database and AWS Logs', async () => {
        const accountNo = '1234567890';
        const startTime = Date.now(); // Record start time for log searching

        // --- 1. ตรวจสอบข้อมูลในฐานข้อมูล (Database) ---
        await test.step('1. Verify record in Database', async () => {
            const sql = 'SELECT * FROM tbl_account WHERE account_no = $1';
            const rows = await db.query(sql, [accountNo]);
            
            expect(rows.length).toBeGreaterThan(0);
            expect(rows[0].status).toBe('ACTIVE');
            console.log(`[DB] Account ${accountNo} is ACTIVE.`);
        });

        // --- 2. ตรวจสอบ Log ใน AWS CloudWatch (AWS Logs) ---
        await test.step('2. Search for SUCCESS logs in CloudWatch', async () => {
            const logGroup = '/aws/lambda/deposit-account-service';
            const pattern = `"${accountNo}" SUCCESS`;
            
            // รอให้ Log ถูกส่งขึ้น CloudWatch เล็กน้อย
            await new Promise(r => setTimeout(r, 5000));

            const events = await awsLogs.findLogs(logGroup, pattern, startTime);
            
            expect(events.length).toBeGreaterThan(0);
            console.log(`[AWS Logs] Found ${events.length} matching log events.`);
            console.log(`[AWS Logs] Latest: ${events[0].message}`);
        });
    });
});
