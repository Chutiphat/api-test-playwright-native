import { test, expect } from '@playwright/test';

test.describe('API sample with header and body assertions', () => {
  test('POST echoes request headers and JSON body', async ({ request }) => {
    const url = 'https://postman-echo.com/post';
    const payload = {
      name: 'Playwright',
      role: 'QA',
      active: true,
    };

    const response = await request.post(url, {
      headers: {
        'content-type': 'application/json',
        'x-custom-header': 'PlaywrightTest',
      },
      data: payload,
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()['server']).toBeTruthy();

    const body = await response.json();

    expect(body).toHaveProperty('url', url);
    expect(body).toHaveProperty('json');
    expect(body).toHaveProperty('headers');
    expect(body).toHaveProperty('data');

    expect(body.json).toEqual(payload);
    expect(body.data).toEqual(payload);
    expect(body.headers).toHaveProperty('x-custom-header', 'PlaywrightTest');
    expect(body.headers).toHaveProperty('content-type', 'application/json');
  });

  test('GET returns expected body fields from JSONPlaceholder', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    expect(body).toHaveProperty('userId', 1);
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
    expect(body.title).toContain('sunt');
    expect(body.body).toContain('quia');
  });
});
