import { expect } from '@playwright/test';
import { testWithCoverage as test } from 'playwright-code-coverage';

test('has title', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
