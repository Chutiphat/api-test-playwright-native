import { test } from '@playwright/test';

const path = require('path');
const Utils = require(path.resolve(__dirname, '../../lib/Utils'));
const utils = new Utils();

const baseUrl = 'https://jsonplaceholder.typicode.com';

test.describe('API Schema Validation', () => {
  // ✅ POST Schema - Simple
  test('POST /posts - Response schema validation', async ({ request }) => {
    const requestBody = {
      title: 'Test Post',
      body: 'Test body',
      userId: 1,
    };

    const response = await request.post(`${baseUrl}/posts`, {
      data: requestBody,
    });

    const body = await response.json();

    // Define the schema (ด้านนี้คือ Blueprint ของ response)
    const schema = {
      type: 'object',
      required: ['id', 'title', 'body', 'userId'],
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        body: { type: 'string' },
        userId: { type: 'number' },
      },
      additionalProperties: false, // ห้าม extra fields
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ GET /users Schema - ที่มี nested object
  test('GET /users/1 - User schema with nested address', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/1`);
    const body = await response.json();

    const schema = {
      type: 'object',
      required: ['id', 'name', 'username', 'email', 'address', 'company'],
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        address: {
          type: 'object',
          required: ['street', 'city', 'zipcode'],
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            zipcode: { type: 'string' },
          },
        },
        company: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            catchPhrase: { type: 'string' },
            bs: { type: 'string' },
          },
        },
      },
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ GET /posts (array) Schema
  test('GET /posts - Array of posts schema validation', async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts?_limit=2`);
    const body = await response.json();

    const schema = {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['userId', 'id', 'title', 'body'],
        properties: {
          userId: { type: 'number' },
          id: { type: 'number' },
          title: { type: 'string' },
          body: { type: 'string' },
        },
      },
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ GET /todos Schema
  test('GET /todos/1 - Todo item schema', async ({ request }) => {
    const response = await request.get(`${baseUrl}/todos/1`);
    const body = await response.json();

    const schema = {
      type: 'object',
      required: ['userId', 'id', 'title', 'completed'],
      properties: {
        userId: { type: 'number' },
        id: { type: 'number' },
        title: { type: 'string' },
        completed: { type: 'boolean' },
      },
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ GET /comments Schema with optional fields
  test('GET /comments?postId=1 - Comments array with optional fields', async ({ request }) => {
    const response = await request.get(`${baseUrl}/comments?postId=1&_limit=2`);
    const body = await response.json();

    const schema = {
      type: 'array',
      items: {
        type: 'object',
        required: ['postId', 'id', 'name', 'email', 'body'],
        properties: {
          postId: { type: 'number' },
          id: { type: 'number' },
          name: { type: 'string' },
          email: { type: 'string' },
          body: { type: 'string' },
        },
      },
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ Example: validate maxLength + boolean
  test('GET /todos/1 - Validate maxLength and boolean schema', async ({ request }) => {
    const response = await request.get(`${baseUrl}/todos/1`);
    const body = await response.json();

    const schema = {
      type: 'object',
      required: ['userId', 'id', 'title', 'completed'],
      properties: {
        userId: { type: 'number' },
        id: { type: 'number' },
        title: { type: 'string', maxLength: 50 },
        completed: { type: 'boolean' },
      },
      additionalProperties: false,
    };

    await utils.validateSchema(schema, body);
  });

  // ✅ Example: maxLength passes when value is within limit
  test('Schema validation passes when title length is within maxLength', async () => {
    const data = {
      title: 'Short title',
      completed: true,
    };

    const schema = {
      type: 'object',
      required: ['title', 'completed'],
      properties: {
        title: { type: 'string', maxLength: 50 },
        completed: { type: 'boolean' },
      },
    };

    await utils.validateSchema(schema, data);
  });

  // ✅ Example: maxLength fails when value exceeds the limit
  test('Schema validation fails when title length exceeds maxLength', async () => {
    const data = {
      title: 'a'.repeat(60),
      completed: true,
    };

    const schema = {
      type: 'object',
      required: ['title', 'completed'],
      properties: {
        title: { type: 'string', maxLength: 50 },
        completed: { type: 'boolean' },
      },
    };

    await utils.validateSchema(schema, data);
  });

  // ✅ Real API Test: POST /posts with title exceeding 50 chars
  test('POST /posts - Verify API accepts long titles (no server-side maxLength validation)', async ({ request }) => {
    const requestBody = {
      titles: 'a'.repeat(60),  // ← REQUEST: ส่ง 60 ตัว
      body: 'Test body for long title',
      userId: 1,
    };

    const response = await request.post(`${baseUrl}/posts`, {
      data: requestBody,
    });

    // Check response status
    const status = response.status();
    const responseBody = await response.json();

    console.log(`Status: ${status}`);
    console.log(`Response contains title: ${responseBody.title ? responseBody.title.length : 'N/A'} chars`);

    // Validation schema for response
    const schema = {
      type: 'object',
      required: ['id', 'title', 'body', 'userId'],
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },  // ← ไม่มี maxLength เพราะ JSONPlaceholder ไม่บังคับ
        body: { type: 'string' },
        userId: { type: 'number' },
      },
    };

    await utils.validateSchema(schema, responseBody);
  });
});
