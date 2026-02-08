// return type of startJSCoverage
export type CoverageReport = {
  url: string;
  scriptId: string;
  source?: string;
  functions: Array<{
    functionName: string;
    isBlockCoverage: boolean;
    ranges: Array<{
      count: number;
      startOffset: number;
      endOffset: number;
    }>;
  }>;
};

export type Attachment = {
  name: string;
  contentType: string;
  path?: string;
  body?: Buffer;
};
