import { createPlaywrightConfig } from './_config-factory';

export default createPlaywrightConfig('npx nx run angular-client:serve', {
  includePatterns: ['**/apps/angular-client/**/*.ts'],
});
