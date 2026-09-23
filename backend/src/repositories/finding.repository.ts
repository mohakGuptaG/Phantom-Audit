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
    category: string;
    title: string;
    description: string;
    severity: IFinding["severity"];
    evidence?: string;
    screenshotId?: string;
  }): Promise<IFinding> {
    return Finding.create({
      scanId: new Types.ObjectId(data.scanId),
      category: data.category,
      title: data.title,
      description: data.description,
      severity: data.severity,
      evidence: data.evidence,
      screenshotId: data.screenshotId
        ? new Types.ObjectId(data.screenshotId)
        : undefined
    });
  }
}