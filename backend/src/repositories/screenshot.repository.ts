import { Types } from "mongoose";
import { Screenshot, IScreenshot } from "../models/screenshot.model";

export class ScreenshotRepository {
  async findByScanId(scanId: string): Promise<IScreenshot[]> {
    return Screenshot.find({
      scanId: new Types.ObjectId(scanId)
    }).sort({ createdAt: -1 });
  }

  async findById(
    screenshotId: string
  ): Promise<IScreenshot | null> {
    return Screenshot.findById(screenshotId);
  }

  async create(data: {
    scanId: string;
    storageKey: string;
    mimeType: string;
    width?: number;
    height?: number;
  }): Promise<IScreenshot> {
    return Screenshot.create({
      scanId: new Types.ObjectId(data.scanId),
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      width: data.width,
      height: data.height
    });
  }
}