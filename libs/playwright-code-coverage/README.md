# Playwright code coverage

Generate istanbul code coverage reports for Playwright tests.

## Prerequisites

- Playwright >= 1.40.0
- Ensure sourcemaps are enabled for dev server/bundle
- Run tests with a chromium-based browser

## Usage

### Install:

```bash
npm i -D playwright-code-coverage
```

### Configure:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { defineCoverageReporterConfig } from 'playwright-code-coverage';

export default defineConfig({
  reporter: [
    [
      'playwright-code-coverage',
      defineCoverageReporterConfig({
        workspaceRoot: __dirname,
      }),
    ],
  ],
});
```

### Instrument your tests:

To enable code coverage for tests you need to use the `testWithCoverage` fixture instead of the regular `test` fixture.

```typescript
import { expect } from '@playwright/test';
import { testWithCoverage as test } from 'playwright-code-coverage';

test('has title', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
```

You can also [extend](https://playwright.dev/docs/test-fixtures#creating-a-fixture) this fixture or [merge]() it.

### Generate coverage report:

Code coverage is generated after each test command is finished and written to the configured output directory (default: `coverage/playwright-code-coverage`).

Default output format is `lcov` but can be configured to use any format supported by `istanbul-reports` like:

- `clover`
- `html`
- `json`
- `text`

## Supported frameworks

In theory this library works with any framework that uses sourcemaps.
However, only the following frameworks have currently been tested:

- `angular 21`

## Configuration

### Configuration options

| Setting           | Description                                                         | Default                                             |
| ----------------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| `workspaceRoot`   | Root folder of project, should be an absolute path                  | None, this is a required field                      |
| `outputDir`       | Folder to write the coverage report to                              | `coverage/playwright-code-coverage`                 |
| `baseURL`         | URL on which the application lives                                  | `http://localhost:4200`                             |
| `bundleLocation`  | Location of the bundle folder on disk                               | None, required when testing with static file server |
| `includePatterns` | glob patterns for including files in coverage report                | `['**/*.ts', '**/*.tsx']`                           |
| `excludePatterns` | glob patterns for excluding files in coverage report                | `[]`                                                |
| `reporters`       | reporters from `istanbul-reports` executed at the end of test suite | `['lcov']`                                          |
| `debug`           | Prints config at start when set                                     | false                                               |

### Configuration examples

#### Standard angular app - dev server

```typescript
import { defineCoverageReporterConfig } from 'playwright-code-coverage';

defineCoverageReporterConfig({
  workspaceRoot: __dirname,
});
```

#### Standard angular app - static file server

```typescript
import { defineCoverageReporterConfig } from 'playwright-code-coverage';

defineCoverageReporterConfig({
  workspaceRoot: __dirname,
  bundleLocation: 'dist/angular-app/browser',
});
```

#### Angular in nx monorepo

```typescript
import { workspaceRoot } from '@nx/devkit';
import { defineCoverageReporterConfig } from 'playwright-code-coverage';

defineCoverageReporterConfig({
  workspaceRoot: workspaceRoot,
  includePatterns: ['**/angular/app/**/*.ts'],
});
```
