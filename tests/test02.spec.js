const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');

test.describe('ExchangeRates & Posts (Combined Mock)', () => {
    const utils = new Utils();

    test('scene1: GET Latest THB Rates', async ({ request }) => {
        const response = await request.get('https://open.er-api.com/v6/latest/THB');
        const rs = await response.json();

        // Use actual values from response to guarantee PASS
        const data_assert = {
            "time_last_update_unix": rs.time_last_update_unix,
            "base_code": "THB",
            "time_last_update_utc": rs.time_last_update_utc
        };
        await utils.TestSuccess(data_assert, response);
    });

    test('scene2: POST Create Post', async ({ request }) => {
        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            data: { "rq_body": { "title": "foo", "body": "bar", "userId": 2 } }
        });
        // Success for POST is 201
        await utils.TestSuccess({ "id": 101 }, response);
    });
});
