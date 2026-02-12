import { createPlaywrightConfig } from './_config-factory';

export default createPlaywrightConfig('npx nx run angular-server:serve', {
  includePatterns: ['**/apps/angular-server/**/*.ts'],
});
