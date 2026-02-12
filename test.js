const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { strictEqual } = require('assert');

const tests = [
  { command: 'playwright:angular:client', fixture: 'angular-client.info' },
  { command: 'playwright:angular:client-bundled', fixture: 'angular-client-bundled.info' },
  { command: 'playwright:angular:server', fixture: 'angular-server.info' },
];

for (const test of tests) {
  execSync(`npx nx run ${test.command}`, { stdio: 'inherit' });
  const file1 = readFileSync('coverage/playwright-code-coverage/lcov.info', 'utf8');
  const file2 = readFileSync(`fixtures/${test.fixture}`, 'utf8');
  strictEqual(file1, file2, 'Files must be identical');
}
