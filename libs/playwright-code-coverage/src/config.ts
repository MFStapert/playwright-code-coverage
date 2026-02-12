import { ReportType } from 'istanbul-reports';

export type CoverageReporterConfig = {
  projectRoot: string;
  outputDir: string;
  baseURL: string;
  bundleLocation: string;
  includePatterns: Array<string>;
  excludePatterns: Array<string>;
  reporters: Array<ReportType>;
};
export const COVERAGE_REPORTER_ANGULAR_PRESET: Partial<CoverageReporterConfig> = {
  outputDir: 'coverage/playwright-code-coverage',
  baseURL: 'http://localhost:4200',
  includePatterns: ['**/*.ts'],
  excludePatterns: [],
  reporters: ['lcov'],
};
