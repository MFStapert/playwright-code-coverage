import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, mkdirSync, rmSync } from 'fs';
import libCoverage, { CoverageMapData } from 'istanbul-lib-coverage';
import { ReportType } from 'istanbul-reports';
import { CoverageReporterConfig } from './config';
import { unmarshallCoverage } from './utils/attachment.utils';
import {
  filterCoverageMap,
  generateReports,
  mapReportsToMapData,
} from './utils/coverage-report.utils';

export class CoverageReporter implements Reporter {
  readonly #coverageMap = libCoverage.createCoverageMap();
  readonly #projectRoot: string;
  readonly #outputDir: string;
  readonly #baseURL: string;
  readonly #bundleLocation: string;
  readonly #includePatterns: Array<string>;
  readonly #excludePatterns: Array<string>;
  readonly #reporters: Array<ReportType>;
  readonly #debug: boolean;

  get #config(): CoverageReporterConfig {
    return {
      projectRoot: this.#projectRoot,
      outputDir: this.#outputDir,
      baseURL: this.#baseURL,
      bundleLocation: this.#bundleLocation,
      includePatterns: this.#includePatterns,
      excludePatterns: this.#excludePatterns,
      reporters: this.#reporters,
    };
  }

  constructor(options?: Partial<CoverageReporterConfig>) {
    if (!options) {
      throw new Error('No configuration provided for coverage reporter');
    }
    if (!options.projectRoot) {
      throw new Error('No project root provided for coverage reporter');
    }
    if (!options.baseURL) {
      throw new Error('No base URL provided for coverage reporter');
    }
    if (!options.includePatterns || !options.includePatterns.length) {
      throw new Error('No include patterns provided for coverage reporter');
    }

    this.#projectRoot = options.projectRoot;
    this.#outputDir = options.outputDir ?? 'coverage/playwright-code-coverage';
    this.#baseURL = options.baseURL;
    this.#bundleLocation = options.bundleLocation ?? '';
    this.#includePatterns = options.includePatterns;
    this.#excludePatterns = options.excludePatterns ?? [];
    this.#reporters = options.reporters ?? ['lcov'];
    this.#debug = options.debug ?? false;

    if (this.#debug) {
      console.info('Coverage reporter configuration:', this.#config);
    }
  }

  onBegin() {
    console.info('Starting coverage reporter...');
    const outputDir = `${this.#config.projectRoot}/${this.#config.outputDir}`;
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true });
    }
    mkdirSync(outputDir, { recursive: true });
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    if (result.attachments) {
      try {
        const coverageReport = unmarshallCoverage(result.attachments);
        const coverageMapData = await mapReportsToMapData(coverageReport, this.#config);
        coverageMapData.forEach((map: CoverageMapData) => this.#coverageMap.merge(map));
      } catch (error) {
        console.error(`Failed to process coverage data for "${test.title}" :`, error);
      }
    }
  }

  async onEnd() {
    const filteredCoverageMap = filterCoverageMap(this.#coverageMap, this.#config);
    generateReports(filteredCoverageMap, this.#config);
    console.info('Coverage reports generated...');
  }
}

export default CoverageReporter;
