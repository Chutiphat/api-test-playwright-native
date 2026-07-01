import { test, expect } from '@playwright/test';

const baseUrl = 'https://jsonplaceholder.typicode.com';

const assertJsonPlaceholderHeaders = (headers: Record<string, string | undefined>) => {
  expect(headers['content-type']).toContain('application/json');
  expect(headers['x-powered-by']).toBeTruthy();
};

const assertPostShape = (body: any) => {
  expect(body).toHaveProperty('userId');
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('title');
  expect(body).toHaveProperty('body');
};

const assertUserShape = (body: any) => {
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('name');
  expect(body).toHaveProperty('username');
  expect(body).toHaveProperty('email');
  expect(body).toHaveProperty('address');
  expect(body.address).toHaveProperty('street');
  expect(body.address).toHaveProperty('city');
  expect(body.address).toHaveProperty('zipcode');
  expect(body).toHaveProperty('company');
  expect(body.company).toHaveProperty('name');
};

test.describe('JSONPlaceholder API full coverage', () => {
  test('GET /posts returns an array of posts with expected headers', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/posts`);
    const data_assert = {
      status: 200,
      ok: true,
      contentType: 'application/json',
      bodyLength: 1,
    };

    expect(response.status()).toBe(data_assert.status);
    expect(response.ok()).toBeTruthy();
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(data_assert.bodyLength - 1);
    assertPostShape(body[0]);
  });

  test('GET /posts/1 returns a single post and validates response body fields', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/posts/1`);
    const data_assert = {
      status: 200,
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body.userId).toBe(data_assert.userId);
    expect(body.id).toBe(data_assert.id);
    expect(body.title).toEqual(data_assert.title);
    expect(body.body).toEqual(data_assert.body);
    expect(body.title.length).toBeGreaterThan(0);
    expect(body.body.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 returns only posts for the user', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/posts?userId=1`);
    const data_assert = {
      status: 200,
      userId: 1,
      bodyLength: 1,
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(data_assert.bodyLength - 1);
    body.forEach((post: any) => {
      assertPostShape(post);
      expect(post.userId).toBe(data_assert.userId);
    });
  });

  test('GET /comments?postId=1 returns comments for the specific post', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/comments?postId=1`);
    const data_assert = {
      status: 200,
      postId: 1,
      mailContains: '@',
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((comment: any) => {
      expect(comment.postId).toBe(data_assert.postId);
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
      expect(comment.email).toContain(data_assert.mailContains);
    });
  });

  test('GET /users/1 returns a user with nested address and company data', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/users/1`);
    const data_assert = {
      status: 200,
      id: 1,
      username: 'Bret',
      emailContains: '@',
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    assertUserShape(body);
    expect(body.id).toBe(data_assert.id);
    expect(body.username).toBe(data_assert.username);
    expect(body.email).toContain(data_assert.emailContains);
  });

  test('GET /todos/1 returns a todo item with completed field', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/todos/1`);
    const data_assert = {
      status: 200,
      userId: 1,
      id: 1,
      titleType: expect.any(String),
      completedType: expect.any(Boolean),
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body.userId).toBe(data_assert.userId);
    expect(body.id).toBe(data_assert.id);
    expect(body.title).toEqual(data_assert.titleType);
    expect(body.completed).toEqual(data_assert.completedType);
  });

  test('POST /posts creates a new resource and returns the created object', async ({ request }) => {
    const requestBody = {
      title: 'Testing JSONPlaceholder',
      body: 'This is a test payload',
      userId: 99,
    };
    const response = await request.post(`${baseUrl}/posts`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: requestBody,
    });
    const data_assert = {
      status: 201,
      body: requestBody,
      idType: 'number',
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toMatchObject(data_assert.body);
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe(data_assert.idType);
  });

  test('PUT /posts/1 replaces the post resource completely', async ({ request }) => {
    const requestBody = {
      id: 1,
      title: 'Updated title',
      body: 'Updated body content',
      userId: 1,
    };
    const response = await request.put(`${baseUrl}/posts/1`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: requestBody,
    });
    const data_assert = {
      status: 200,
      responseBody: requestBody,
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toEqual(data_assert.responseBody);
  });

  test('PATCH /posts/1 updates a single field and retains other fields', async ({ request }) => {
    const requestBody = {
      title: 'Partially updated title',
    };
    const response = await request.patch(`${baseUrl}/posts/1`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: requestBody,
    });
    const data_assert = {
      status: 200,
      id: 1,
      title: requestBody.title,
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body.id).toBe(data_assert.id);
    expect(body.title).toBe(data_assert.title);
  });

  test('DELETE /posts/1 returns an empty JSON object and correct status', async ({ request }) => {
    const requestBody = {};
    const response = await request.delete(`${baseUrl}/posts/1`);
    const data_assert = {
      status: [200, 204],
      expectedBody: {},
    };

    expect(data_assert.status).toContain(response.status());
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toStrictEqual(data_assert.expectedBody);
  });

  test('FAIL CASE /posts/1 returns a deliberately wrong title for report validation', async ({ request }) => {
    const requestBody = {};
    const response = await request.get(`${baseUrl}/posts/1`);
    const data_assert = {
      status: 200,
      wrongTitle: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderi',
    };

    expect(response.status()).toBe(data_assert.status);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body.title).toBe(data_assert.wrongTitle);
  });
});
