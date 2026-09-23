import mongoose from "mongoose";
import {
  FINDING_SEVERITIES,
  FindingSeverity,
  IFinding
} from "../models/finding.model";
import { FindingRepository } from "../repositories/finding.repository";

export interface CreateFindingInput {
  scanId: string;
  category: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  evidence?: string;
  screenshotId?: string;
}

export class FindingService {
  constructor(
    private readonly findingRepository: FindingRepository
  ) {}

  async getFindingsByScanId(
    scanId: string
  ): Promise<IFinding[]> {
    this.validateScanId(scanId);

    return this.findingRepository.findByScanId(scanId);
  }

  async createFinding(
    input: CreateFindingInput
  ): Promise<IFinding> {
    this.validateScanId(input.scanId);

    if (!input.category?.trim()) {
      throw new Error("Finding category is required");
    }

    if (!input.title?.trim()) {
      throw new Error("Finding title is required");
    }

    if (!input.description?.trim()) {
      throw new Error("Finding description is required");
    }

    if (!this.isFindingSeverity(input.severity)) {
      throw new Error("Invalid finding severity");
    }

    if (
      input.screenshotId &&
      !mongoose.isValidObjectId(input.screenshotId)
    ) {
      throw new Error("Invalid screenshot ID");
    }

    return this.findingRepository.create({
      scanId: input.scanId,
      category: input.category.trim(),
      title: input.title.trim(),
      description: input.description.trim(),
      severity: input.severity,
      evidence: input.evidence?.trim(),
      screenshotId: input.screenshotId
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
      FINDING_SEVERITIES.includes(
        severity as FindingSeverity
      )
    );
  }
}