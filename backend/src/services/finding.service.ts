import mongoose from "mongoose";
import {
  FINDING_SEVERITIES,
  FindingSeverity,
  IFinding
} from "../models/finding.model";
import { FindingRepository } from "../repositories/finding.repository";
import { ScanRepository } from "../repositories/scan.repository";
import { ScreenshotRepository } from "../repositories/screenshot.repository";

export interface CreateFindingInput {
  scanId: string;
  patternType: string;
  severity: FindingSeverity;
  confidence?: number;
  description: string;
  pageType?: string;
  screenshotId?: string;
  boundingBox?: IFinding["boundingBox"];
  evidence?: string;
}

export class FindingService {
  constructor(
    private readonly findingRepository: FindingRepository,
    private readonly scanRepository: ScanRepository,
    private readonly screenshotRepository: ScreenshotRepository
  ) {}

  async getFindingsByScanId(scanId: string): Promise<IFinding[]> {
    this.validateScanId(scanId);

    return this.findingRepository.findByScanId(scanId);
  }

  async createFinding(input: CreateFindingInput): Promise<IFinding> {
    this.validateScanId(input.scanId);

    const scan = await this.scanRepository.findById(input.scanId);

    if (!scan) {
      throw new Error("Scan not found");
    }

    if (!input.patternType?.trim()) {
      throw new Error("Finding pattern type is required");
    }

    if (!input.description?.trim()) {
      throw new Error("Finding description is required");
    }

    if (!this.isFindingSeverity(input.severity)) {
      throw new Error("Invalid finding severity");
    }

    if (
      input.confidence !== undefined &&
      (input.confidence < 0 || input.confidence > 1)
    ) {
      throw new Error("Finding confidence must be between 0 and 1");
    }

    if (input.screenshotId) {
      if (!mongoose.isValidObjectId(input.screenshotId)) {
        throw new Error("Invalid screenshot ID");
      }

      const screenshot = await this.screenshotRepository.findById(
        input.screenshotId
      );

      if (!screenshot) {
        throw new Error("Screenshot not found");
      }
    }

    if (input.boundingBox) {
      const { x, y, width, height } = input.boundingBox;

      if (x < 0 || y < 0 || width < 0 || height < 0) {
        throw new Error("Finding bounding box values must be non-negative");
      }
    }

    return this.findingRepository.create({
      scanId: input.scanId,
      patternType: input.patternType.trim(),
      severity: input.severity,
      confidence: input.confidence,
      description: input.description.trim(),
      pageType: input.pageType?.trim(),
      screenshotId: input.screenshotId,
      boundingBox: input.boundingBox,
      evidence: input.evidence?.trim()
    });
  }

  private validateScanId(scanId: string): void {
    if (!mongoose.isValidObjectId(scanId)) {
      throw new Error("Invalid scan ID");
    }
  }

  private isFindingSeverity(
    severity: unknown
  ): severity is FindingSeverity {
    return (
      typeof severity === "string" &&
      FINDING_SEVERITIES.includes(severity as FindingSeverity)
    );
  }
}