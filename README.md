# Playwright Code coverage

Monorepo for `playwright code coverage` a reporter library for generating code coverage reports.

## Library usage

For info on the library view the [this README.](./libs/playwright-code-coverage/README.md)

## How this library works

Playwright can generate code coverage reports for chromium based browsers.
There are 3 main issues preventing this from being an out of the box solution:

- Coverage reports aren't aggregated across multiple runs.
- Code coverage reports are in v8 format which is not supported by most code coverage tools.
- You can't directly map the generated v8 coverage to the original source code.

This library aims to solve these issues:

### Aggregating the coverage across multiple runs.

This library uses a playwright reporter to store coverage data in memory using the `istanbul-lib-coverage` coverageMap.
To pass data to this reporter, we use the testInfo property to attach the v8CoverageReport as a file.
The reporter then converts the coverage and merges it with the existing coverageMap.

### Converting the v8 coverage to istanbul coverage format

This library uses the `v8toIstanbul` library to convert the v8 coverage to istanbul coverage format.
Some filtering is applied beforehand, like remote urls and certain framework urls being exluded.
There are some quirks when dealing with `v8toIstanbul`; since this library tries to resolve sourcemaps when called.
Certain dev servers like angular generate inline sourcemaps which dont need to be resolved.
But when bundling the app and serving it statically, you need to re-write the script paths to point to the original source files.

### Mapping the generated istanbul coverage to the original source code.

The coverage playwright receives references locations like `localhost:xxxx/src/index.ts` which can't be mapped to the original source code.
Mapping this is dependent on project structure, currently this only works for angular projects in regular and monorepo setups.
I've tried cleaning up the input for the `v8toIstanbul` library, hoping it would result in correct mappings.
But there are to many edge cases to cover, it's easier to just map the coverage manually.

## Using this repo

This repo contains the code for the library in the `libs` folder and `apps` for testing.
In the `apps` folder there are multiple frontend projects to test the library against, also a playwright project to run the library against the frontend projects.
There is a verdacio app for locally publishing the library.
Currently, the library only has an e2e test; `npm run test` will tun the library against all tested frontend projects and compare generated coverage.

## Todos

- Commit lint
- github releases
- Check format in ci
- Dependabot config
- Add unit test setup
- Add additional frameworks for testing

## Resources used

- [Playwright code coverage](https://playwright.dev/docs/api/class-coverage)
- [Playwright reporters](https://playwright.dev/docs/test-reporters)
- [similar lib by bgotink](https://github.com/bgotink/playwright-coverage)
