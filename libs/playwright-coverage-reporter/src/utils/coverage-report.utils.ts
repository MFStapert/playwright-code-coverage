import libCoverage, { CoverageMap, CoverageMapData } from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { minimatch } from 'minimatch';
import { join } from 'path';
import v8toIstanbul from 'v8-to-istanbul';
import { CoverageReporterConfig } from '../config';
import { CoverageReport } from '../types';

// Used to exclude files from remote servers
const isServerUrl = (url: string, config: CoverageReporterConfig): boolean => {
  return url.startsWith(config.serverUrl);
};

// Files from local server that start with @fs can't be mapped to source files
const isFsPath = (path: string): boolean => {
  return path.indexOf('@fs') > 0;
};

// Maps script urls from playwright report to local file paths
const urlToPath = (url: string, config: CoverageReporterConfig): string => {
  const urlObj = new URL(url);
  const { pathname } = urlObj;

  return join(config.projectRoot, pathname);
};

const mapPlaywrightCoverageToIstanbul = async (
  entry: CoverageReport,
  config: CoverageReporterConfig,
): Promise<CoverageMapData | null> => {
  if (
    isFsPath(entry.url) ||
    !isServerUrl(entry.url, config) ||
    !entry.source ||
    entry.functions.length === 0
  ) {
    return null;
  }
  const filePath = urlToPath(entry.url, config);
  const converter = v8toIstanbul(filePath, 0, entry.source ? { source: entry.source } : undefined);
  await converter.load();
  converter.applyCoverage(entry.functions);

  return converter.toIstanbul();
};

export const mapReportToMapData = async (
  coverageReports: Array<CoverageReport>,
  config: CoverageReporterConfig,
): Promise<Array<CoverageMapData>> => {
  const istanbulCoverage = await Promise.all(
    coverageReports.map(async entry => mapPlaywrightCoverageToIstanbul(entry, config)),
  );
  return istanbulCoverage.filter(mappedData => mappedData !== null);
};

export const filterCoverageMap = (
  coverageMap: CoverageMap,
  config: CoverageReporterConfig,
): CoverageMap => {
  const filteredCoverage = libCoverage.createCoverageMap();
  coverageMap.files().forEach(filePath => {
    const isIncluded = config.includePatterns.some(pattern => minimatch(filePath, pattern));

    const isExcluded = config.excludePatterns.some(pattern => minimatch(filePath, pattern));

    if (isIncluded && !isExcluded) {
      filteredCoverage.addFileCoverage(coverageMap.fileCoverageFor(filePath));
    }
  });
  return filteredCoverage;
};

export const generateReports = (coverageMap: CoverageMap, config: CoverageReporterConfig): void => {
  const context = libReport.createContext({
    dir: `${config.projectRoot}/${config.outputDir}`,
    coverageMap,
  });

  config.reporters.forEach(reportType => {
    const report = reports.create(reportType, {
      projectRoot: config.projectRoot,
    });

    report.execute(context);
  });
};
