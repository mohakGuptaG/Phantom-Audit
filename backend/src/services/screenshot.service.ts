import mongoose from "mongoose";
import { IScreenshot } from "../models/screenshot.model";
import { ScreenshotRepository } from "../repositories/screenshot.repository";

export interface CreateScreenshotInput {
  scanId: string;
  storageKey: string;
  mimeType: string;
  width?: number;
  height?: number;
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

    if (!input.storageKey?.trim()) {
      throw new Error("Screenshot storage key is required");
    }

    if (!input.mimeType?.trim()) {
      throw new Error("Screenshot MIME type is required");
    }

    if (input.width !== undefined && input.width < 1) {
      throw new Error("Screenshot width must be greater than 0");
    }

    if (input.height !== undefined && input.height < 1) {
      throw new Error("Screenshot height must be greater than 0");
    }

    return this.screenshotRepository.create({
      scanId: input.scanId,
      storageKey: input.storageKey.trim(),
      mimeType: input.mimeType.trim(),
      width: input.width,
      height: input.height
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