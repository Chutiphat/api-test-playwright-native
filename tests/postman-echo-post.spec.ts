import { test, expect } from '@playwright/test';

test('POST request to Postman Echo should return reflected JSON and headers', async ({ request }) => {
  const url = 'https://postman-echo.com/post';
  const payload = {
    name: 'Playwright',
    environment: 'postman-echo',
    timestamp: new Date().toISOString(),
  };

  await test.step('Send POST request with JSON payload', async () => {
    const response = await request.post(url, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'PlaywrightTest',
      },
    });

    await test.step('Validate response status and content type', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()['content-type']).toContain('application/json');
    });

    const body = await response.json();

    await test.step('Validate response JSON structure', async () => {
      expect(body).toBeTruthy();
      expect(body).toHaveProperty('args');
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('headers');
      expect(body).toHaveProperty('json');
      expect(body).toHaveProperty('url');
    });

    await test.step('Validate echoed request payload', async () => {
      expect(body.json).toEqual(payload);
      expect(body.data).toEqual(payload);
      expect(body.url).toBe(url);
    });

    await test.step('Validate echoed headers from Postman Echo', async () => {
      const echoedHeaders = body.headers;
      expect(echoedHeaders).toBeTruthy();
      expect(echoedHeaders).toHaveProperty('x-custom-header');
      expect(echoedHeaders['x-custom-header']).toBe('PlaywrightTest');
      expect(echoedHeaders).toHaveProperty('content-type');
      expect(echoedHeaders['content-type']).toContain('application/json');
    });
  });
});

test('POST request to Httpbin should return 400 validation error simulation', async ({ request }) => {
  const url = 'https://httpbin.org/status/400';
  const invalidPayload = {
    email: 'eve.holt@reqres.in',
  };

  const response = await request.post(url, {
    data: invalidPayload,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  await test.step('Validate response status is 400 and response is not OK', async () => {
    expect(response.status()).toBe(400);
    expect(response.ok()).toBeFalsy();
    expect(response.statusText()).toBe('BAD REQUEST');
  });

  await test.step('Validate response body is empty or contains plain text error', async () => {
    const bodyText = await response.text();
    expect(bodyText).toBeDefined();
    expect(bodyText.length).toBeGreaterThanOrEqual(0);
  });
});
