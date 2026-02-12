import { createPlaywrightConfig } from './_config-factory';

export default createPlaywrightConfig('npx nx run angular-client:serve-static', {
  bundleLocation: 'dist/apps/angular-client/browser',
  includePatterns: ['**/apps/angular-client/**/*.ts'],
});
