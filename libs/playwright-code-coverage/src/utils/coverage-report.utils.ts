import { CoverageMapData } from 'istanbul-lib-coverage';
import { join } from 'path';
import v8toIstanbul from 'v8-to-istanbul';
import { CoverageReporterConfig } from '../config';
import { CoverageReport } from '../models';

const isBaseURL = (url: string, config: CoverageReporterConfig): boolean => {
  return url.startsWith(config.baseURL);
};

const isFsPath = (path: string): boolean => {
  // Not source files in angular, pain to map
  return path.indexOf('@fs') > 0;
};

// Only map in case of "bundled angular app"
// Bundled js in this mode does not contain inline sourcemaps
// So we need this for v8ToIstanbull to handle path resolution
const mapCoverageReportToScriptPath = (
  coverageReport: CoverageReport,
  config: CoverageReporterConfig,
): string => {
  if (config.bundleLocation) {
    const urlObj = new URL(coverageReport.url);
    const { pathname } = urlObj;
    return join(`${config.projectRoot}/${config.bundleLocation}`, pathname);
  } else {
    return coverageReport.url;
  }
};

const mapPlaywrightCoverageToIstanbul = async (
  coverageReport: CoverageReport,
  config: CoverageReporterConfig,
): Promise<CoverageMapData | null> => {
  if (
    isFsPath(coverageReport.url) ||
    !isBaseURL(coverageReport.url, config) ||
    !coverageReport.source ||
    !(coverageReport.functions.length > 0)
  ) {
    return null;
  }
  const converter = v8toIstanbul(
    mapCoverageReportToScriptPath(coverageReport, config),
    0,
    coverageReport.source ? { source: coverageReport.source } : undefined,
  );
  await converter.load();
  converter.applyCoverage(coverageReport.functions);

  return converter.toIstanbul();
};

export const mapReportsToMapData = async (
  coverageReports: CoverageReport[],
  config: CoverageReporterConfig,
): Promise<CoverageMapData[]> => {
  const istanbulCoverage = await Promise.all(
    coverageReports.map(async entry => mapPlaywrightCoverageToIstanbul(entry, config)),
  );
  return istanbulCoverage.filter(mappedData => mappedData !== null);
};
