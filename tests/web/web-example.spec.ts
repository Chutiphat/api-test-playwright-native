import { test, expect } from '@playwright/test';

test.describe('Web examples', () => {
  test('opens the Playwright homepage', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });
});
