import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { COVERAGE_REPORTER_NX_ANGULAR_PRESET } from '@playwright/coverage-reporter';
import { defineConfig, devices } from '@playwright/test';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx nx run angular-client-app:serve',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [
    ['list'],
    [
      '../../libs/playwright-coverage-reporter/src/coverage-reporter.ts',
      {
        ...COVERAGE_REPORTER_NX_ANGULAR_PRESET,
        includePatterns: ['apps/angular-client-app'],
      },
    ],
  ],
});
