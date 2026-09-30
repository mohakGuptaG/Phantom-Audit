import mongoose from "mongoose";
import { IScreenshot } from "../models/screenshot.model";
import { ScreenshotRepository } from "../repositories/screenshot.repository";

export interface CreateScreenshotInput {
  scanId: string;
  pageType: string;
  filePath: string;
  capturedAt: Date;
}

export class ScreenshotService {
  constructor(
    private readonly screenshotRepository: ScreenshotRepository
  ) {}

  async getScreenshotsByScanId(
    scanId: string
  ): Promise<IScreenshot[]> {
    this.validateScanId(scanId);

    return this.screenshotRepository.findByScanId(scanId);
  }

  async getScreenshotById(
    screenshotId: string
  ): Promise<IScreenshot | null> {
    this.validateScreenshotId(screenshotId);

    return this.screenshotRepository.findById(screenshotId);
  }

  async createScreenshot(
    input: CreateScreenshotInput
  ): Promise<IScreenshot> {
    this.validateScanId(input.scanId);

    if (!input.pageType?.trim()) {
      throw new Error("Screenshot page type is required");
    }

    if (!input.filePath?.trim()) {
      throw new Error("Screenshot file path is required");
    }

    if (!(input.capturedAt instanceof Date)) {
      throw new Error("Screenshot capturedAt must be a valid date");
    }

    if (Number.isNaN(input.capturedAt.getTime())) {
      throw new Error("Screenshot capturedAt must be a valid date");
    }

    return this.screenshotRepository.create({
      scanId: input.scanId,
      pageType: input.pageType.trim(),
      filePath: input.filePath.trim(),
      capturedAt: input.capturedAt
    });
  }

  private validateScanId(scanId: string): void {
    if (!mongoose.isValidObjectId(scanId)) {
      throw new Error("Invalid scan ID");
    }
  }

  private validateScreenshotId(screenshotId: string): void {
    if (!mongoose.isValidObjectId(screenshotId)) {
      throw new Error("Invalid screenshot ID");
    }
  }
}