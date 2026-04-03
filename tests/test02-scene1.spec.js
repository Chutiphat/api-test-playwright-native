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

        // Validate all fields in a single data_assert object for consistent reporting
        const data_assert = {
            "time_last_update_unix": 1775001751,
            "base_code": "THB",
            "time_last_update_utc": /^Wed, 01 Apr 2026 \d{2}:\d{2}:\d{2} \+\d{4}$/,
            "rates": {
                "THB": 1,
                "JOD": 0.02165,
                "USD": 0.030536,
            }
        };
        
        await utils.TestSuccess(data_assert, response);
    });
});
