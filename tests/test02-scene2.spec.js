const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');
const JsonPlaceholderApi = require('../lib/api/JsonPlaceholderApi');

test.describe('CreatePost (Scene 2)', () => {
    const utils = new Utils();

    test('scene2: POST Create Post', async ({ request }) => {
        const postApi = new JsonPlaceholderApi(request);
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

        const requestBody = {
            "rq_body": {
                "title": "foo",
                "body": "bar",
                "userId": 2
            }
        };

        const response = await postApi.createPost(headers, requestBody);
        
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
