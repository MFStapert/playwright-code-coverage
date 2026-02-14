# Playwright Code coverage

Monorepo for `playwright code coverage`, a library for generating Istanbul code coverage reports from Playwright tests.

## Library usage

For info on the library, view [this README](./libs/playwright-code-coverage/README.md).

## How this library works

Playwright can generate code coverage reports for Chromium-based browsers.
There are 3 main issues preventing this from being an out-of-the-box solution:

- Coverage reports aren't aggregated across multiple runs.
- Code coverage reports are in v8 format, which is not supported by most code coverage tools.
- You can't directly map the generated v8 coverage to the original source code.

This library aims to solve these issues:

### Aggregating the coverage across multiple runs

This library uses a Playwright reporter to store coverage data in memory using the `istanbul-lib-coverage` coverageMap.
To pass data to this reporter, we use the testInfo property to attach the v8CoverageReport as a file.
The reporter then converts the coverage and merges it with the existing coverageMap.

### Converting the v8 coverage to Istanbul coverage format

This library uses the `v8toIstanbul` library to convert the v8 coverage to Istanbul coverage format.
Some filtering is applied beforehand, like remote URLs and certain framework URLs being excluded.
There are some quirks when dealing with `v8toIstanbul`; since this library tries to resolve source maps when called.
Certain dev servers like Angular generate inline source maps which don't need to be resolved.
But when bundling the app and serving it statically, you need to rewrite the script paths to point to the original source files.

### Mapping the generated Istanbul coverage to the original source code

The coverage Playwright receives references locations like `localhost:xxxx/src/index.ts`, which can't be mapped to the original source code.
Mapping this is dependent on project structure. Currently, this only works for Angular projects in regular and monorepo setups.
I've tried cleaning up the input for the `v8toIstanbul` library, hoping it would result in correct mappings.
But there are too many edge cases to cover—it's easier to just map the coverage manually.

## Using this repo

This repo contains the code for the library in the `libs` folder and `apps` for testing.
In the `apps` folder, there are multiple frontend projects to test the library against, as well as a Playwright project to run the library against the frontend projects.
There is a Verdaccio app for locally publishing the library.
Currently, the library only has an e2e test; `npm run test` will run the library against all tested frontend projects and compare generated coverage.

## Resources used

- [Playwright code coverage](https://playwright.dev/docs/api/class-coverage)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [A similar lib by bgotink](https://github.com/bgotink/playwright-coverage)
