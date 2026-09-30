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
      scanId: "6ab40f2a31d9796493ee8357",
      category: "TEST",
      title: "Test finding",
      description: "Test description",
      severity: "LOW"
    } as unknown as IFinding;

    scanRepository.findById.mockResolvedValue(
      {} as never
    );

    findingRepository.create.mockResolvedValue(
      mockFinding
    );

    const result = await findingService.createFinding({
      scanId: "6ab40f2a31d9796493ee8357",
      category: " TEST ",
      title: " Test finding ",
      description: " Test description ",
      severity: "LOW",
      evidence: " Test evidence "
    });

    expect(
      scanRepository.findById
    ).toHaveBeenCalledWith(
      "6ab40f2a31d9796493ee8357"
    );

    expect(
      findingRepository.create
    ).toHaveBeenCalledWith({
      scanId: "6ab40f2a31d9796493ee8357",
      category: "TEST",
      title: "Test finding",
      description: "Test description",
      severity: "LOW",
      evidence: "Test evidence",
      screenshotId: undefined
    });

    expect(result).toBe(mockFinding);
  });

  it("rejects an invalid scan ID", async () => {
    await expect(
      findingService.createFinding({
        scanId: "invalid-id",
        category: "TEST",
        title: "Test finding",
        description: "Test description",
        severity: "LOW"
      })
    ).rejects.toThrow("Invalid scan ID");

    expect(
      scanRepository.findById
    ).not.toHaveBeenCalled();

    expect(
      findingRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects an invalid severity", async () => {
    scanRepository.findById.mockResolvedValue(
      {} as never
    );

    await expect(
      findingService.createFinding({
        scanId: "6ab40f2a31d9796493ee8357",
        category: "TEST",
        title: "Test finding",
        description: "Test description",
        severity: "INVALID" as never
      })
    ).rejects.toThrow("Invalid finding severity");

    expect(
      findingRepository.create
    ).not.toHaveBeenCalled();
  });

  it("rejects a finding when the scan does not exist", async () => {
    scanRepository.findById.mockResolvedValue(null);

    await expect(
      findingService.createFinding({
        scanId: "6ab40f2a31d9796493ee8357",
        category: "TEST",
        title: "Test finding",
        description: "Test description",
        severity: "LOW"
      })
    ).rejects.toThrow("Scan not found");

    expect(
      scanRepository.findById
    ).toHaveBeenCalledWith(
      "6ab40f2a31d9796493ee8357"
    );

    expect(
      findingRepository.create
    ).not.toHaveBeenCalled();
  });

  it("creates a finding with an existing screenshot", async () => {
    const mockFinding = {
      _id: "finding-id",
      scanId: "6ab40f2a31d9796493ee8357",
      category: "VISUAL",
      title: "Test screenshot finding",
      description: "Test description",
      severity: "MEDIUM",
      screenshotId: "7ab40f2a31d9796493ee8357"
    } as unknown as IFinding;

    scanRepository.findById.mockResolvedValue(
      {} as never
    );

    screenshotRepository.findById.mockResolvedValue(
      {} as never
    );

    findingRepository.create.mockResolvedValue(
      mockFinding
    );

    const result = await findingService.createFinding({
      scanId: "6ab40f2a31d9796493ee8357",
      category: "VISUAL",
      title: "Test screenshot finding",
      description: "Test description",
      severity: "MEDIUM",
      screenshotId: "7ab40f2a31d9796493ee8357"
    });

    expect(
      screenshotRepository.findById
    ).toHaveBeenCalledWith(
      "7ab40f2a31d9796493ee8357"
    );

    expect(
      findingRepository.create
    ).toHaveBeenCalled();

    expect(result).toBe(mockFinding);
  });

  it("rejects a finding when the screenshot does not exist", async () => {
    scanRepository.findById.mockResolvedValue(
      {} as never
    );

    screenshotRepository.findById.mockResolvedValue(
      null
    );

    await expect(
      findingService.createFinding({
        scanId: "6ab40f2a31d9796493ee8357",
        category: "VISUAL",
        title: "Test screenshot finding",
        description: "Test description",
        severity: "MEDIUM",
        screenshotId: "7ab40f2a31d9796493ee8357"
      })
    ).rejects.toThrow("Screenshot not found");

    expect(
      screenshotRepository.findById
    ).toHaveBeenCalledWith(
      "7ab40f2a31d9796493ee8357"
    );

    expect(
      findingRepository.create
    ).not.toHaveBeenCalled();
  });
});