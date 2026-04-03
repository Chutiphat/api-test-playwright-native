const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');
const TestHelper = require('../lib/TestHelper');
const JsonPlaceholderApi = require('../lib/api/JsonPlaceholderApi');

test.describe('CreatePost (Scene 2)', () => {
    const utils = new Utils();

    test('scene2: POST Create Post', async ({ request }) => {
        const postApi = new JsonPlaceholderApi(request);
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const headers = {
            ...TestHelper.getOpsHeaders(requestId, traceParent),
            'datetime': `${date}T${time}`
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
