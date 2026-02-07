import { playwrightCoverageReporter } from './playwright-coverage-reporter';

describe('playwrightCoverageReporter', () => {
  it('should work', () => {
    expect(playwrightCoverageReporter()).toEqual('playwright-coverage-reporter');
  });
});
