const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');

test.describe('Postman Collection: test02', () => {
    const utils = new Utils();

    test('scene1: GET Latest THB Rates', async ({ request }) => {
        // Prerequest: generate message-id
        const { requestId } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const response = await request.get('https://open.er-api.com/v6/latest/THB', {
            headers: {
                'x-request-id': requestId,
                'x-job-id': requestId,
                'x-real-ip': '127.0.0.1',
                'x-caller-service': 'FrontEnd',
                'x-caller-domain': 'Front',
                'datetime': `${date}T${time}`,
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Fnx-Header': JSON.stringify({ "identity": { "userRoles": ["developer"] } })
            }
        });

        // Tests
        await utils.LogResponse(response);
        const rs = await response.json();
        console.log(rs);

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
        // Note: In real scenarios, exchange rates change. 
        // If this fails due to updated rates, consider using "mandatory" or "TYPE_NUMBER"
        await utils.TestSuccess(data_assert, response);
    });

    test('scene2: POST Create Post', async ({ request }) => {
        // Prerequest: generate message-id
        const { requestId } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const requestBody = {
            "rq_body": {
                "title": "foo",
                "body": "bar",
                "userId": 2
            }
        };

        const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'x-request-id': requestId,
                'x-job-id': requestId,
                'x-real-ip': '127.0.0.1',
                'x-caller-service': 'FrontEnd',
                'x-caller-domain': 'Front',
                'datetime': `${date}T${time}`,
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Fnx-Header': JSON.stringify({ "identity": { "userRoles": ["developer"] } })
            },
            data: requestBody
        });

        // Tests
        await utils.LogResponse(response);
        const rs = await response.json();

        const data_assert = {
            "rq_body": {
                "title": "foo",
                "body": "bar",
                "userId": 2
            },
            "id": 101
        };
        await utils.TestSuccess(data_assert, response);
    });
});
