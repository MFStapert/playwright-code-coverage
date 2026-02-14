import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { existsSync, mkdirSync, rmSync } from 'fs';
import libCoverage, { CoverageMapData } from 'istanbul-lib-coverage';
import { CoverageReporterConfig, defineCoverageReporterConfig } from './config';
import { unmarshallCoverage } from './utils/attachment.utils';
import {
  filterCoverageMap,
  generateReports,
  postProcessIstanbulCoverMap,
} from './utils/coverage-map.utils';
import { mapReportsToMapData } from './utils/coverage-report.utils';

export class CoverageReporter implements Reporter {
  readonly #coverageMap = libCoverage.createCoverageMap();
  readonly #config: CoverageReporterConfig;

  constructor(options?: Partial<CoverageReporterConfig>) {
    if (!options) {
      throw new Error('No configuration provided for coverage reporter');
    }
    if (!options.workspaceRoot) {
      throw new Error('No project root provided for coverage reporter');
    }
    if (!options.includePatterns || !options.includePatterns.length) {
      throw new Error('No include patterns provided for coverage reporter');
    }
    this.#config = defineCoverageReporterConfig(options);

    if (this.#config.debug) {
      console.info('Coverage reporter configuration:', this.#config);
    }
  }

  onBegin() {
    console.info('Starting coverage reporter...');
    const outputDir = `${this.#config.workspaceRoot}/${this.#config.outputDir}`;
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
        coverageMapData.forEach((map: CoverageMapData) => {
          const postProcessedCoverageMap = postProcessIstanbulCoverMap(map, this.#config);
          this.#coverageMap.merge(postProcessedCoverageMap);
        });
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
