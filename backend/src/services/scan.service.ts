import mongoose from "mongoose";
import {
  IScan,
  ScanStatus
} from "../models/scan.model";
import { ScanRepository } from "../repositories/scan.repository";

const ALLOWED_TRANSITIONS: Record<ScanStatus, ScanStatus[]> = {
  CREATED: ["STARTING", "FAILED", "CANCELLED"],
  STARTING: ["NAVIGATING", "FAILED", "CANCELLED"],
  NAVIGATING: ["CAPTURING", "FAILED", "CANCELLED"],
  CAPTURING: ["ANALYZING", "FAILED", "CANCELLED"],
  ANALYZING: ["SCORING", "FAILED", "CANCELLED"],
  SCORING: ["COMPLETED", "FAILED"],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: []
};

export class ScanService {
  constructor(private readonly scanRepository: ScanRepository) {}

  async createScan(url: string): Promise<IScan> {
    const normalizedUrl = this.validateAndNormalizeUrl(url);

    return this.scanRepository.create(normalizedUrl);
  }

  async getScan(scanId: string): Promise<IScan | null> {
    this.validateScanId(scanId);

    return this.scanRepository.findById(scanId);
  }

  async updateScanStatus(
    scanId: string,
    nextStatus: ScanStatus
  ): Promise<IScan> {
    this.validateScanId(scanId);

    const scan = await this.scanRepository.findById(scanId);

    if (!scan) {
      throw new Error("Scan not found");
    }

    const allowedStatuses = ALLOWED_TRANSITIONS[scan.status];

    if (!allowedStatuses.includes(nextStatus)) {
      throw new Error(
        `Invalid scan status transition: ${scan.status} -> ${nextStatus}`
      );
    }

    const updatedScan = await this.scanRepository.updateStatus(
      scanId,
      nextStatus
    );

    if (!updatedScan) {
      throw new Error("Failed to update scan status");
    }

    return updatedScan;
  }

  async failScan(
    scanId: string,
    error: string
  ): Promise<IScan> {
    this.validateScanId(scanId);

    const scan = await this.scanRepository.findById(scanId);

    if (!scan) {
      throw new Error("Scan not found");
    }

    if (["COMPLETED", "FAILED", "CANCELLED"].includes(scan.status)) {
      throw new Error(
        `Cannot fail scan from status: ${scan.status}`
      );
    }

    const updatedScan = await this.scanRepository.updateFailure(
      scanId,
      error
    );

    if (!updatedScan) {
      throw new Error("Failed to mark scan as failed");
    }

    return updatedScan;
  }

  private validateScanId(scanId: string): void {
    if (!mongoose.isValidObjectId(scanId)) {
      throw new Error("Invalid scan ID");
    }
  }

  private validateAndNormalizeUrl(url: string): string {
    if (!url || typeof url !== "string") {
      throw new Error("URL is required");
    }

    const trimmedUrl = url.trim();

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      throw new Error("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("URL must use HTTP or HTTPS");
    }

    return parsedUrl.toString();
  }
}