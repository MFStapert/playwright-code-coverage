import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import { CoverageReporterConfig, defineCoverageReporterConfig } from 'playwright-code-coverage';

export function createPlaywrightConfig(
  serveCommand: string,
  config: Partial<CoverageReporterConfig>,
): PlaywrightTestConfig {
  return defineConfig({
    ...nxE2EPreset(__filename, { testDir: '../src' }),
    use: {
      baseURL: 'http://localhost:4200',
      trace: 'on-first-retry',
    },
    webServer: {
      command: serveCommand,
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
        '../../../libs/playwright-code-coverage/src/coverage-reporter.ts',
        defineCoverageReporterConfig({
          projectRoot: workspaceRoot,
          debug: true,
          ...config,
        }),
      ],
    ],
  });
}
