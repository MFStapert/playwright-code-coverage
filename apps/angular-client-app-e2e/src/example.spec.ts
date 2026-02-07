import { testWithCoverage as test } from '@playwright/coverage-reporter';
import { expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');

  // Doesn't work because reporter cleans coverage dir at start of run
  // const fixtureContent = readFileSync(join(__dirname, '../fixtures/lcov.info'), 'utf-8');
  // const reporterContent = readFileSync(
  //   join(__dirname, '../../../coverage/playwright-coverage-reporter/lcov.info'),
  //   'utf-8',
  // );
  //
  // expect(fixtureContent).toBe(reporterContent);
});
