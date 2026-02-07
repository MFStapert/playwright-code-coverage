import CoverageReporter from './coverage-reporter';

describe('playwrightCoverageReporter', () => {
  it('should work', () => {
    expect(new CoverageReporter()).not.toBe(null);
  });
});
