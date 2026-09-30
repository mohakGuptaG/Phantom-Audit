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
    const mockScreenshot = {
      _id: "screenshot-id",
      scanId: "6ab40f2a31d9796493ee8357",
      storageKey: "scans/test/screenshot.png",
      mimeType: "image/png",
      width: 1280,
      height: 720
    } as unknown as IScreenshot;

    screenshotRepository.create.mockResolvedValue(
      mockScreenshot
    );

    const result = await screenshotService.createScreenshot({
      scanId: "6ab40f2a31d9796493ee8357",
      storageKey: " scans/test/screenshot.png ",
      mimeType: " image/png ",
      width: 1280,
      height: 720
    });

    expect(screenshotRepository.create).toHaveBeenCalledWith({
      scanId: "6ab40f2a31d9796493ee8357",
      storageKey: "scans/test/screenshot.png",
      mimeType: "image/png",
      width: 1280,
      height: 720
    });

    expect(result).toBe(mockScreenshot);
  });

  it("rejects an invalid scan ID", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId: "invalid-id",
        storageKey: "scans/test/screenshot.png",
        mimeType: "image/png"
      })
    ).rejects.toThrow("Invalid scan ID");

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects a missing storage key", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId: "6ab40f2a31d9796493ee8357",
        storageKey: "",
        mimeType: "image/png"
      })
    ).rejects.toThrow(
      "Screenshot storage key is required"
    );

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects invalid dimensions", async () => {
    await expect(
      screenshotService.createScreenshot({
        scanId: "6ab40f2a31d9796493ee8357",
        storageKey: "scans/test/screenshot.png",
        mimeType: "image/png",
        width: 0
      })
    ).rejects.toThrow(
      "Screenshot width must be greater than 0"
    );

    expect(
      screenshotRepository.create
    ).not.toHaveBeenCalled();
  });
});