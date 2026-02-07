import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, mkdirSync, rmSync } from 'fs';
import libCoverage from 'istanbul-lib-coverage';
import { CoverageReporterConfig } from './config';
import { unmarshallCoverage } from './utils/attachment.utils';
import {
  filterCoverageMap,
  generateReports,
  mapPlaywrightCoverageToIstanbulCoverage,
} from './utils/coverage-report.utils';

export class CoverageReporter implements Reporter {
  readonly #options: CoverageReporterConfig;

  readonly #coverageMap = libCoverage.createCoverageMap();

  constructor(options?: CoverageReporterConfig) {
    if (!options) {
      throw new Error('No configuration provided for coverage reporter');
    }
    this.#options = options;
  }

  onBegin() {
    console.info('Starting coverage reporter...');
    const outputDir = process.cwd() + this.#options.outputDir;
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true });
    }
    mkdirSync(outputDir, { recursive: true });
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    if (result.status !== 'failed' && result.attachments) {
      try {
        const coverageReport = unmarshallCoverage(result.attachments);
        const coverageMap = await mapPlaywrightCoverageToIstanbulCoverage(
          coverageReport,
          this.#options,
        );
        coverageMap.forEach(map => this.#coverageMap.merge(map));
      } catch (error) {
        console.error(`Failed to process coverage data for "${test.title}" :`, error);
      }
    }
  }

  async onExit() {
    const filteredCoverageMap = filterCoverageMap(this.#coverageMap, this.#options);
    generateReports(filteredCoverageMap, this.#options);
    console.info('Coverage reports generated...');
  }
}

export default CoverageReporter;
