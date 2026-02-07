import libCoverage, { CoverageMap, CoverageMapData } from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { minimatch } from 'minimatch';
import { join } from 'path';
import v8toIstanbul from 'v8-to-istanbul';
import { CoverageReporterConfig } from '../config';
import { CoverageReport } from '../types';

const urlToPath = (url: string, options: CoverageReporterConfig): string => {
  if (url.startsWith(options.serverUrl)) {
    const urlObj = new URL(url);
    const { pathname } = urlObj;
    return join(process.cwd(), pathname);
  }

  return url;
};

export const mapPlaywrightCoverageToIstanbulCoverage = async (
  coverageEntries: Array<CoverageReport>,
  options: CoverageReporterConfig,
): Promise<Array<CoverageMapData>> => {
  const istanbulCoverage = await Promise.all(
    coverageEntries.map(async entry => {
      if (entry.url.startsWith(options.serverUrl)) {
        const filePath = urlToPath(entry.url, options);
        const converter = v8toIstanbul(
          filePath,
          0,
          entry.source ? { source: entry.source } : undefined,
        );
        await converter.load();
        converter.applyCoverage(entry.functions);

        return converter.toIstanbul();
      }
      return null;
    }),
  );
  return istanbulCoverage.filter(mappedData => mappedData !== null);
};

export const filterCoverageMap = (coverageMap: CoverageMap, options: CoverageReporterConfig) => {
  const filteredCoverage = libCoverage.createCoverageMap();
  coverageMap.files().forEach(filePath => {
    const isIncluded = options.includePatterns.some(pattern => minimatch(filePath, pattern));

    const isExcluded = options.excludePatterns.some(pattern => minimatch(filePath, pattern));

    if (isIncluded && !isExcluded) {
      filteredCoverage.addFileCoverage(coverageMap.fileCoverageFor(filePath));
    }
  });
  return filteredCoverage;
};

export const generateReports = (coverageMap: CoverageMap, options: CoverageReporterConfig) => {
  const context = libReport.createContext({
    dir: process.cwd() + options.outputDir,
    coverageMap,
    watermarks: {
      statements: [50, 80],
      functions: [50, 80],
      branches: [50, 80],
      lines: [50, 80],
    },
  });

  options.reporters.forEach(reportType => {
    const report = reports.create(reportType, {
      skipEmpty: false,
      skipFull: false,
      projectRoot: process.cwd(),
    });

    report.execute(context);
  });
};
