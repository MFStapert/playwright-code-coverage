import { test } from '@playwright/test';
import { coverageFileKey, marshallCoverage } from './utils/attachment.utils';

export const testWithCoverage = test.extend({
  page: async ({ page }, use, testInfo) => {
    await page.coverage.startJSCoverage();

    await use(page);

    const coverage = await page.coverage.stopJSCoverage();
    await testInfo.attach(coverageFileKey, marshallCoverage(coverage));
  },
});
