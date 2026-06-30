import { test, expect } from '@playwright/test';

test('search Playwright on Google', async ({ page }) => {
  await page.goto('https://www.google.com', { waitUntil: 'load' });

  // Try to close common consent dialogs if present
  const consentSelectors = [
    'button:has-text("I agree")',
    'button:has-text("Accept all")',
    'button:has-text("ตกลง")',
    'button:has-text("ยอมรับทั้งหมด")',
    'button:has-text("ยอมรับ")',
  ];
  for (const sel of consentSelectors) {
    const b = page.locator(sel);
    if (await b.count()) {
      await b.first().click().catch(() => {});
      break;
    }
  }

  // Robust search box locator: prefer name=q, fallback to role=combobox (localized)
  let search = page.locator('input[name="q"]');
  if (await search.count() === 0) {
    search = page.getByRole('combobox', { name: /ค้นหา|Search/i });
  }
  await search.waitFor({ state: 'visible', timeout: 10000 });
  await search.fill('Playwright');
  await search.press('Enter');

  await page.waitForURL(/search.*q=Playwright/i, { timeout: 15000 });
  const blockedByGoogle = await page.locator('text=Our systems have detected unusual traffic from your computer network').count();

  if (blockedByGoogle) {
    const blockedScreenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('google-bot-check', { body: blockedScreenshot, contentType: 'image/png' });

    await page.goto('https://duckduckgo.com', { waitUntil: 'load' });
    const ddSearch = page.locator('input[name="q"], input#search_form_input_homepage');
    await ddSearch.waitFor({ state: 'visible', timeout: 10000 });
    await ddSearch.fill('Playwright');
    await page.keyboard.press('Enter');
    await page.waitForURL(/q=Playwright/, { timeout: 15000 });

    const ddResults = page.locator('article').first();
    await ddResults.waitFor({ state: 'visible', timeout: 15000 });
    await expect(page).toHaveTitle(/Playwright/i);
  } else {
    await page.waitForSelector('#search', { state: 'visible', timeout: 15000 });
    await expect(page.locator('#search')).toContainText(/Playwright/i);
    await expect(page).toHaveTitle(/Playwright/i);
  }

  await test.step('Capture screenshot of search results', async () => {
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach('google-search-results', { body: screenshot, contentType: 'image/png' });
  });
});
