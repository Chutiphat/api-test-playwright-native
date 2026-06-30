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
    const response = await request.get(`${baseUrl}/posts`);
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    assertPostShape(body[0]);
  });

  test('GET /posts/1 returns a single post and validates response body fields', async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts/1`);
    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toStrictEqual({
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
    expect(body.title.length).toBeGreaterThan(0);
    expect(body.body.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 returns only posts for the user', async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts?userId=1`);
    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((post: any) => {
      assertPostShape(post);
      expect(post.userId).toBe(1);
    });
  });

  test('GET /comments?postId=1 returns comments for the specific post', async ({ request }) => {
    const response = await request.get(`${baseUrl}/comments?postId=1`);
    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((comment: any) => {
      expect(comment).toHaveProperty('postId', 1);
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('name');
      expect(comment).toHaveProperty('email');
      expect(comment).toHaveProperty('body');
      expect(comment.email).toContain('@');
    });
  });

  test('GET /users/1 returns a user with nested address and company data', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/1`);
    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    assertUserShape(body);
    expect(body.id).toBe(1);
    expect(body.username).toBe('Bret');
    expect(body.email).toContain('@');
  });

  test('GET /todos/1 returns a todo item with completed field', async ({ request }) => {
    const response = await request.get(`${baseUrl}/todos/1`);
    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toHaveProperty('userId', 1);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title', expect.any(String));
    expect(body).toHaveProperty('completed', expect.any(Boolean));
  });

  test('POST /posts creates a new resource and returns the created object', async ({ request }) => {
    const payload = {
      title: 'Testing JSONPlaceholder',
      body: 'This is a test payload',
      userId: 99,
    };
    const response = await request.post(`${baseUrl}/posts`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: payload,
    });

    expect(response.status()).toBe(201);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');
  });

  test('PUT /posts/1 replaces the post resource completely', async ({ request }) => {
    const payload = {
      id: 1,
      title: 'Updated title',
      body: 'Updated body content',
      userId: 1,
    };
    const response = await request.put(`${baseUrl}/posts/1`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: payload,
    });

    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toEqual(payload);
  });

  test('PATCH /posts/1 updates a single field and retains other fields', async ({ request }) => {
    const payload = {
      title: 'Partially updated title',
    };
    const response = await request.patch(`${baseUrl}/posts/1`, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      data: payload,
    });

    expect(response.status()).toBe(200);
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title', payload.title);
  });

  test('DELETE /posts/1 returns an empty JSON object and correct status', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/posts/1`);
    expect([200, 204]).toContain(response.status());
    assertJsonPlaceholderHeaders(response.headers());

    const body = await response.json();
    expect(body).toStrictEqual({});
  });
});
