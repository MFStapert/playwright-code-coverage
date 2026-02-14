import libCoverage, { CoverageMap, CoverageMapData } from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { minimatch } from 'minimatch';
import { CoverageReporterConfig } from '../config';

export const postProcessIstanbulCoverMap = (
  coverageMapData: CoverageMapData,
  config: CoverageReporterConfig,
): CoverageMapData => {
  const newCoverMapData = {} as CoverageMapData;
  Object.entries(coverageMapData).forEach(entries => {
    const [key, entry] = entries;
    let newKey;
    if (config.bundleLocation) {
      newKey = key.replace(`/${config.bundleLocation}`, '');
    } else {
      const doubleSlashRemoved = config.baseURL.replace('//', '/');
      newKey = key.replace(`/${doubleSlashRemoved}`, '');
    }

    newCoverMapData[newKey] = entry;
  });

  Object.values(coverageMapData).forEach(coverage => {
    if (config.bundleLocation) {
      coverage.path = coverage.path.replace(`/${config.bundleLocation}`, '');
      return;
    }
    const doubleSlashRemoved = config.baseURL.replace('//', '/');
    coverage.path = coverage.path.replace(`/${doubleSlashRemoved}`, '');
  });

  return newCoverMapData;
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
    dir: `${config.workspaceRoot}/${config.outputDir}`,
    coverageMap,
  });

  config.reporters.forEach(reportType => {
    const report = reports.create(reportType, {
      projectRoot: config.workspaceRoot,
    });

    report.execute(context);
  });
};
