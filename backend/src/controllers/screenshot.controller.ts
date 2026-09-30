import { Request, Response } from "express";
import { ScreenshotRepository } from "../repositories/screenshot.repository";
import { ScreenshotService } from "../services/screenshot.service";

const screenshotService = new ScreenshotService(
  new ScreenshotRepository()
);

export const getScreenshot = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { screenshotId } = req.params;

    if (Array.isArray(screenshotId)) {
      res.status(400).json({ error: "Invalid screenshot ID" });
      return;
    }

    const screenshot =
      await screenshotService.getScreenshotById(screenshotId);

    if (!screenshot) {
      res.status(404).json({ error: "Screenshot not found" });
      return;
    }

    res.status(200).json(screenshot);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve screenshot";

    res.status(400).json({ error: message });
  }
};