const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');
const ExchangeApi = require('../lib/api/ExchangeApi');

test.describe('ExchangeRates (Scene 1)', () => {
    const utils = new Utils();

    test('scene1: GET Latest THB Rates', async ({ request }) => {
        const exchangeApi = new ExchangeApi(request);
        const { requestId } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const headers = {
            'x-request-id': requestId,
            'x-job-id': requestId,
            'x-real-ip': '127.0.0.1',
            'datetime': `${date}T${time}`,
            'accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const response = await exchangeApi.getLatestRates(headers, 'THB');
        
        await utils.LogResponse(response);
        const rs = await response.json();

        // รวมการเช็กทุกอย่างไว้ใน data_assert ก้อนเดียว
        // เพื่อให้ Utils.js แสดงผลแบบ expected vs actual ใน Report อัตโนมัติ
        const data_assert = {
            "time_last_update_unix": 1775088151,
            "base_code": "THB",
            "time_last_update_utc": /^Thu, 02 Apr 2026 \d{2}:\d{2}:\d{2} \+\d{4}$/,
            "rates": {
                "THB": 1,
                "JOD": 0.021787,
                "USD": 0.03073,
            }
        };
        
        // ฟังก์ชันนี้จะทำหน้าที่ร้อยเรียงผลลัพธ์ลง Report ให้สวยงามเองครับ
        await utils.TestSuccess(data_assert, response);
    });
});
