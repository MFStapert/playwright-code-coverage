import { createPlaywrightConfig } from './_config-factory';

export default createPlaywrightConfig('npx nx run angular-client:serve', [
  '**/apps/angular-client/**/*.ts',
]);
