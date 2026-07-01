import { test } from '@playwright/test';
const Utils = require('../lib/Utils');

/**
 * 🎬 Scenario: JSON Schema Validation
 * Ensuring the API response matches the expected blueprint (Data Types & Required Fields).
 */
test.describe('JSON Schema Validation @schema', () => {
    const utils = new Utils();

    test('Should match the API response with the defined Schema', async ({ request }) => {
        // 1. Fetch Actual Data
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
        const body = await response.json();

        // 2. Define the Blueprint (Schema)
        const schema = {
            type: "object",
            required: ["userId", "id", "title", "body"],
            properties: {
                userId: { type: "number" },
                id:     { type: "number" },
                title:  { type: "string" },
                body:   { type: "string" }
            },
            additionalProperties: false // ไม่ยอมให้มีฟิลด์เกินมา
        };

        // 3. Perform Validation
        await utils.validateSchema(schema, body);
    });
});
