const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');

/**
 * Combined Scenario: Exchange Rates & JSON Posts
 * Demonstrates multiple API validations in a single spec file.
 */
test.describe('ExchangeRates & Posts (Combined)', () => {
    const utils = new Utils();

    test('scene1: GET Latest THB Rates', async ({ request }) => {
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const response = await request.get('https://open.er-api.com/v6/latest/THB', {
            headers: {
                ...TestHelper.getOpsHeaders(requestId, traceParent),
                'datetime': `${date}T${time}`
            }
        });

        await utils.LogResponse(response);
        const data_assert = {
            "time_last_update_unix": 1775001751,
            "base_code": "THB",
            "time_last_update_utc": /^Wed, 01 Apr 2026 \d{2}:\d{2}:\d{2} \+\d{4}$/
        };
        await utils.TestSuccess(data_assert, response);
    });

    test('scene2: POST Create Post', async ({ request }) => {
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            headers: {
                ...TestHelper.getOpsHeaders(requestId, traceParent),
                'datetime': `${date}T${time}`
            },
            data: {
                "rq_body": { "title": "foo", "body": "bar", "userId": 2 }
            }
        });

        await utils.LogResponse(response);
        await utils.TestSuccess({ "id": 101 }, response);
    });
});
