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
    pageType: string;
    filePath: string;
    capturedAt: Date;
  }): Promise<IScreenshot> {
    return Screenshot.create({
      scanId: new Types.ObjectId(data.scanId),
      pageType: data.pageType,
      filePath: data.filePath,
      capturedAt: data.capturedAt
    });
  }
}