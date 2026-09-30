import {
  describe,
  beforeEach,
  it,
  expect,
  jest
} from "@jest/globals";

import { ScreenshotService } from "../src/services/screenshot.service";
import { IScreenshot } from "../src/models/screenshot.model";
import { ScreenshotRepository } from "../src/repositories/screenshot.repository";

describe("ScreenshotService", () => {
  let screenshotService: ScreenshotService;
  let screenshotRepository: jest.Mocked<ScreenshotRepository>;

  const scanId = "6ab40f2a31d9796493ee8357";

  beforeEach(() => {
    screenshotRepository = {
      create: jest.fn(),
      findByScanId: jest.fn(),
      findById: jest.fn()
    } as unknown as jest.Mocked<ScreenshotRepository>;

    screenshotService = new ScreenshotService(
      screenshotRepository
    );
  });

  it("creates a valid screenshot through the repository", async () => {
    const capturedAt = new Date("2026-09-30T10:00:00.000Z");

    const mockScreenshot = {
      _id: "screenshot-id",
      scanId,
      pageType: "PRODUCT",
      filePath: "scans/test/screenshot.png",
      capturedAt
    } as unknown as IScreenshot;

    screenshotRepository.create.mockResolvedValue(
      mockScreenshot
    );

    const result = await screenshotService.createScreenshot({
      scanId,
      pageType: " PRODUCT ",
      filePath: " scans/test/screenshot.png ",
      capturedAt
    });

    expect(screenshotRepository.create).toHaveBeenCalledWith({
      scanId,
      pageType: "PRODUCT",
      filePath: "scans/test/screenshot.png",
      capturedAt
    });

    expect(result).toBe(mockScreenshot);
  });

  it("rejects an invalid scan ID", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId: "invalid-id",
        pageType: "PRODUCT",
        filePath: "scans/test/screenshot.png",
        capturedAt: new Date()
      })
    ).rejects.toThrow("Invalid scan ID");

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects a missing page type", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId,
        pageType: "",
        filePath: "scans/test/screenshot.png",
        capturedAt: new Date()
      })
    ).rejects.toThrow(
      "Screenshot page type is required"
    );

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects a missing file path", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId,
        pageType: "PRODUCT",
        filePath: "",
        capturedAt: new Date()
      })
    ).rejects.toThrow(
      "Screenshot file path is required"
    );

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects an invalid capturedAt date", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId,
        pageType: "PRODUCT",
        filePath: "scans/test/screenshot.png",
        capturedAt: new Date("invalid")
      })
    ).rejects.toThrow(
      "Screenshot capturedAt must be a valid date"
    );

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });
});