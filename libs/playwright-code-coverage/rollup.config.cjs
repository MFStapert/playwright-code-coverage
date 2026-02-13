const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    assets: ['./README.md'],
    main: './src/index.ts',
    outputPath: '../../dist/libs/playwright-code-coverage',
    tsConfig: './tsconfig.lib.json',
    compiler: 'tsc',
    format: ['esm']
  },
);
