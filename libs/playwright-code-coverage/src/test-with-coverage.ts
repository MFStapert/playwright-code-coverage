import { test } from '@playwright/test';
import { coverageFileKey, marshallCoverage } from './utils/attachment.utils';

export const testWithCoverage = test.extend({
  page: async ({ context, page }, use, testInfo) => {
    if (context.browser()?.browserType()?.name() === 'chromium') {
      await page.coverage.startJSCoverage();

      await use(page);

      const coverage = await page.coverage.stopJSCoverage();
      await testInfo.attach(coverageFileKey, marshallCoverage(coverage));
    } else {
      console.info('Skipped coverage after test run for non chromium browser...');
    }
  },
});
