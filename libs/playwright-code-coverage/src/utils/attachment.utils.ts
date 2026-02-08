import { Attachment, CoverageReport } from '../models';

export const coverageFileKey = 'coverage';

export const marshallCoverage = (coverage: Array<CoverageReport>) => {
  return {
    body: Buffer.from(JSON.stringify(coverage)),
    contentType: 'application/json',
  };
};

export const unmarshallCoverage = (attachments: Array<Attachment>) => {
  const coverageAttachment = attachments.find(a => a.name === coverageFileKey);

  if (coverageAttachment?.body) {
    return JSON.parse(coverageAttachment.body.toString()) as Array<CoverageReport>;
  }
  return [];
};
