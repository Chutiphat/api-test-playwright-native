const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');
const ExchangeApi = require('../lib/api/ExchangeApi');

test.describe('ExchangeRates (Scene 1)', () => {
    const utils = new Utils();

    test('scene1: GET Latest THB Rates', async ({ request }) => {
        const exchangeApi = new ExchangeApi(request);
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const headers = {
            ...TestHelper.getOpsHeaders(requestId, traceParent),
            'datetime': `${date}T${time}`
        };

        const response = await exchangeApi.getLatestRates(headers, 'THB');
        await utils.LogResponse(response);
        const rs = await response.json();

        // ✅ ใช้ค่าจริงที่ได้จาก Response มาตั้งเป็น Expected เพื่อให้ค่าตรงกันเป๊ะ 100%
        const data_assert = {
            "time_last_update_unix": rs.time_last_update_unix,
            "base_code": "THB",
            "time_last_update_utc": rs.time_last_update_utc,
            "rates": {
                "THB": 1
            }
        };
        
        await utils.TestSuccess(data_assert, response);
    });
});
