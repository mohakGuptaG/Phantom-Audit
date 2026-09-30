import { Types } from "mongoose";
import { Finding, IFinding } from "../models/finding.model";

export class FindingRepository {
  async findByScanId(scanId: string): Promise<IFinding[]> {
    return Finding.find({
      scanId: new Types.ObjectId(scanId)
    }).sort({ createdAt: -1 });
  }

  async create(data: {
    scanId: string;
    patternType: string;
    severity: IFinding["severity"];
    confidence?: number;
    description: string;
    pageType?: string;
    screenshotId?: string;
    boundingBox?: IFinding["boundingBox"];
    evidence?: string;
  }): Promise<IFinding> {
    return Finding.create({
      scanId: new Types.ObjectId(data.scanId),
      patternType: data.patternType,
      severity: data.severity,
      confidence: data.confidence,
      description: data.description,
      pageType: data.pageType,
      screenshotId: data.screenshotId
        ? new Types.ObjectId(data.screenshotId)
        : undefined,
      boundingBox: data.boundingBox,
      evidence: data.evidence
    });
  }
}