import {
  describe,
  beforeEach,
  it,
  expect,
  jest
} from "@jest/globals";

import { FindingService } from "../src/services/finding.service";
import { IFinding } from "../src/models/finding.model";
import { FindingRepository } from "../src/repositories/finding.repository";
import { ScanRepository } from "../src/repositories/scan.repository";
import { ScreenshotRepository } from "../src/repositories/screenshot.repository";

describe("FindingService", () => {
  let findingService: FindingService;
  let findingRepository: jest.Mocked<FindingRepository>;
  let scanRepository: jest.Mocked<ScanRepository>;
  let screenshotRepository: jest.Mocked<ScreenshotRepository>;

  const scanId = "6ab40f2a31d9796493ee8357";
  const screenshotId = "7ab40f2a31d9796493ee8357";

  beforeEach(() => {
    findingRepository = {
      create: jest.fn(),
      findByScanId: jest.fn()
    } as unknown as jest.Mocked<FindingRepository>;

    scanRepository = {
      findById: jest.fn()
    } as unknown as jest.Mocked<ScanRepository>;

    screenshotRepository = {
      create: jest.fn(),
      findByScanId: jest.fn(),
      findById: jest.fn()
    } as unknown as jest.Mocked<ScreenshotRepository>;

    findingService = new FindingService(
      findingRepository,
      scanRepository,
      screenshotRepository
    );
  });

  it("creates a valid finding through the repository", async () => {
    const mockFinding = {
      _id: "finding-id",
      scanId,
      patternType: "TEST_PATTERN",
      severity: "LOW",
      confidence: 0.95,
      description: "Test description",
      pageType: "PRODUCT",
      evidence: "Test evidence",
      boundingBox: {
        x: 10,
        y: 20,
        width: 100,
        height: 50
      }
    } as unknown as IFinding;

    scanRepository.findById.mockResolvedValue({} as never);
    findingRepository.create.mockResolvedValue(mockFinding);

    const result = await findingService.createFinding({
      scanId,
      patternType: " TEST_PATTERN ",
      severity: "LOW",
      confidence: 0.95,
      description: " Test description ",
      pageType: " PRODUCT ",
      evidence: " Test evidence ",
      boundingBox: {
        x: 10,
        y: 20,
        width: 100,
        height: 50
      }
    });

    expect(scanRepository.findById).toHaveBeenCalledWith(scanId);

    expect(findingRepository.create).toHaveBeenCalledWith({
      scanId,
      patternType: "TEST_PATTERN",
      severity: "LOW",
      confidence: 0.95,
      description: "Test description",
      pageType: "PRODUCT",
      evidence: "Test evidence",
      boundingBox: {
        x: 10,
        y: 20,
        width: 100,
        height: 50
      },
      screenshotId: undefined
    });

    expect(result).toBe(mockFinding);
  });

  it("rejects an invalid scan ID", async () => {
    await expect(
      findingService.createFinding({
        scanId: "invalid-id",
        patternType: "TEST_PATTERN",
        severity: "LOW",
        description: "Test description"
      })
    ).rejects.toThrow("Invalid scan ID");

    expect(scanRepository.findById).not.toHaveBeenCalled();
    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects an invalid severity", async () => {
    scanRepository.findById.mockResolvedValue({} as never);

    await expect(
      findingService.createFinding({
        scanId,
        patternType: "TEST_PATTERN",
        severity: "INVALID" as never,
        description: "Test description"
      })
    ).rejects.toThrow("Invalid finding severity");

    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects a finding when the scan does not exist", async () => {
    scanRepository.findById.mockResolvedValue(null);

    await expect(
      findingService.createFinding({
        scanId,
        patternType: "TEST_PATTERN",
        severity: "LOW",
        description: "Test description"
      })
    ).rejects.toThrow("Scan not found");

    expect(scanRepository.findById).toHaveBeenCalledWith(scanId);
    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("creates a finding with an existing screenshot", async () => {
    const mockFinding = {
      _id: "finding-id",
      scanId,
      patternType: "VISUAL_PATTERN",
      severity: "MEDIUM",
      confidence: 0.85,
      description: "Test screenshot finding",
      pageType: "PRODUCT",
      screenshotId
    } as unknown as IFinding;

    scanRepository.findById.mockResolvedValue({} as never);
    screenshotRepository.findById.mockResolvedValue({} as never);
    findingRepository.create.mockResolvedValue(mockFinding);

    const result = await findingService.createFinding({
      scanId,
      patternType: "VISUAL_PATTERN",
      severity: "MEDIUM",
      confidence: 0.85,
      description: "Test screenshot finding",
      pageType: "PRODUCT",
      screenshotId
    });

    expect(screenshotRepository.findById).toHaveBeenCalledWith(
      screenshotId
    );

    expect(findingRepository.create).toHaveBeenCalledWith({
      scanId,
      patternType: "VISUAL_PATTERN",
      severity: "MEDIUM",
      confidence: 0.85,
      description: "Test screenshot finding",
      pageType: "PRODUCT",
      screenshotId,
      boundingBox: undefined,
      evidence: undefined
    });

    expect(result).toBe(mockFinding);
  });

  it("rejects a finding when the screenshot does not exist", async () => {
    scanRepository.findById.mockResolvedValue({} as never);
    screenshotRepository.findById.mockResolvedValue(null);

    await expect(
      findingService.createFinding({
        scanId,
        patternType: "VISUAL_PATTERN",
        severity: "MEDIUM",
        description: "Test screenshot finding",
        screenshotId
      })
    ).rejects.toThrow("Screenshot not found");

    expect(screenshotRepository.findById).toHaveBeenCalledWith(
      screenshotId
    );

    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects confidence outside the 0 to 1 range", async () => {
    scanRepository.findById.mockResolvedValue({} as never);

    await expect(
      findingService.createFinding({
        scanId,
        patternType: "TEST_PATTERN",
        severity: "LOW",
        confidence: 1.5,
        description: "Test description"
      })
    ).rejects.toThrow("Finding confidence must be between 0 and 1");

    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects negative bounding box values", async () => {
    scanRepository.findById.mockResolvedValue({} as never);

    await expect(
      findingService.createFinding({
        scanId,
        patternType: "TEST_PATTERN",
        severity: "LOW",
        description: "Test description",
        boundingBox: {
          x: -1,
          y: 20,
          width: 100,
          height: 50
        }
      })
    ).rejects.toThrow(
      "Finding bounding box values must be non-negative"
    );

    expect(findingRepository.create).not.toHaveBeenCalled();
  });
});