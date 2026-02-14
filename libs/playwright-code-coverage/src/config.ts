import { ReportType } from 'istanbul-reports';

export type CoverageReporterConfig = {
  workspaceRoot: string;
  outputDir: string;
  baseURL: string;
  bundleLocation: string;
  includePatterns: string[];
  excludePatterns: string[];
  reporters: ReportType[];
  debug?: boolean;
};

export const COVERAGE_REPORTER_DEFAULTS = {
  outputDir: 'coverage/playwright-code-coverage',
  reporters: ['lcov'] as ReportType[],
  baseUrl: 'http://localhost:4200',
  includePatterns: ['**/*.ts', '**/*.tsx'],
};

export const defineCoverageReporterConfig = (
  config: Partial<CoverageReporterConfig>,
): CoverageReporterConfig => {
  return {
    workspaceRoot: config.workspaceRoot ?? '',
    outputDir: config.outputDir ?? COVERAGE_REPORTER_DEFAULTS.outputDir,
    baseURL: config.baseURL ?? COVERAGE_REPORTER_DEFAULTS.baseUrl,
    reporters: config.reporters ?? COVERAGE_REPORTER_DEFAULTS.reporters,
    bundleLocation: config.bundleLocation ?? '',
    includePatterns: config.includePatterns ?? COVERAGE_REPORTER_DEFAULTS.includePatterns,
    excludePatterns: config.excludePatterns ?? [],
    debug: config.debug ?? false,
  };
};
