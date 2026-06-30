import { test, expect } from '@playwright/test';

test.describe('API examples', () => {
  test('GET returns expected status', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  test('POST creates a resource', async ({ request }) => {
    const payload = { title: 'Playwright', body: 'TypeScript', userId: 1 };
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject(payload);
  });
});
