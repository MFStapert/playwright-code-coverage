import { ReportType } from 'istanbul-reports';

export type CoverageReporterConfig = {
  outputDir: string;
  serverUrl: string;
  includePatterns: Array<string>;
  excludePatterns: Array<string>;
  reporters: Array<ReportType>;
};
export const COVERAGE_REPORTER_NX_ANGULAR_PRESET: CoverageReporterConfig = {
  outputDir: '/coverage/integration',
  serverUrl: 'http://localhost:4200',
  includePatterns: [''],
  excludePatterns: ['**/*.routes.ts', '**/*.config.ts', '**/*.spec.ts', 'environment.ts'],
  reporters: ['html', 'lcov'],
};
