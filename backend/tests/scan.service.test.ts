import {
  describe,
  beforeEach,
  it,
  expect,
  jest
} from "@jest/globals";

import { ScanService } from "../src/services/scan.service";
import { IScan } from "../src/models/scan.model";
import { ScanRepository } from "../src/repositories/scan.repository";

describe("ScanService", () => {
  let scanService: ScanService;
  let scanRepository: jest.Mocked<ScanRepository>;

  const scanId = "6ab40f2a31d9796493ee8357";

  beforeEach(() => {
    scanRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
      updateFailure: jest.fn()
    } as unknown as jest.Mocked<ScanRepository>;

    scanService = new ScanService(scanRepository);
  });

  it("creates a scan with a valid URL", async () => {
    const mockScan = {
      _id: "scan-id",
      url: "https://example.com/",
      status: "CREATED"
    } as unknown as IScan;

    scanRepository.create.mockResolvedValue(mockScan);

    const result = await scanService.createScan(
      "https://example.com"
    );

    expect(scanRepository.create).toHaveBeenCalledWith(
      "https://example.com/"
    );

    expect(result).toBe(mockScan);
  });

  it("rejects an invalid URL", async () => {
    await expect(
      scanService.createScan("not-a-valid-url")
    ).rejects.toThrow("Invalid URL");

    expect(
      scanRepository.create
    ).not.toHaveBeenCalled();
  });

  it("looks up an existing scan", async () => {
    const mockScan = {
      _id: "scan-id",
      url: "https://example.com/",
      status: "CREATED"
    } as unknown as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);

    const result = await scanService.getScan(scanId);

    expect(
      scanRepository.findById
    ).toHaveBeenCalledWith(scanId);

    expect(result).toBe(mockScan);
  });

  it("rejects an invalid scan ID during lookup", async () => {
    await expect(
      scanService.getScan("invalid-id")
    ).rejects.toThrow("Invalid scan ID");

    expect(
      scanRepository.findById
    ).not.toHaveBeenCalled();
  });

  it("sets startedAt when a scan enters STARTING", async () => {
    const mockScan = {
      _id: scanId,
      url: "https://example.com/",
      status: "CREATED"
    } as unknown as IScan;

    const updatedScan = {
      ...mockScan,
      status: "STARTING",
      startedAt: new Date()
    } as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);
    scanRepository.updateStatus.mockResolvedValue(updatedScan);

    const result = await scanService.updateScanStatus(
      scanId,
      "STARTING"
    );

    expect(scanRepository.updateStatus).toHaveBeenCalledWith(
      scanId,
      "STARTING",
      expect.objectContaining({
        startedAt: expect.any(Date)
      })
    );

    expect(result).toBe(updatedScan);
  });

  it("sets completedAt when a scan enters COMPLETED", async () => {
    const mockScan = {
      _id: scanId,
      url: "https://example.com/",
      status: "SCORING",
      startedAt: new Date()
    } as unknown as IScan;

    const updatedScan = {
      ...mockScan,
      status: "COMPLETED",
      completedAt: new Date()
    } as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);
    scanRepository.updateStatus.mockResolvedValue(updatedScan);

    const result = await scanService.updateScanStatus(
      scanId,
      "COMPLETED"
    );

    expect(scanRepository.updateStatus).toHaveBeenCalledWith(
      scanId,
      "COMPLETED",
      expect.objectContaining({
        completedAt: expect.any(Date)
      })
    );

    expect(result).toBe(updatedScan);
  });

  it("stores errorMessage when a scan fails", async () => {
    const mockScan = {
      _id: scanId,
      url: "https://example.com/",
      status: "NAVIGATING"
    } as unknown as IScan;

    const updatedScan = {
      ...mockScan,
      status: "FAILED",
      errorMessage: "Navigation failed"
    } as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);
    scanRepository.updateFailure.mockResolvedValue(updatedScan);

    const result = await scanService.failScan(
      scanId,
      " Navigation failed "
    );

    expect(
      scanRepository.updateFailure
    ).toHaveBeenCalledWith(
      scanId,
      "Navigation failed"
    );

    expect(result).toBe(updatedScan);
  });

  it("rejects an empty failure error message", async () => {
    const mockScan = {
      _id: scanId,
      url: "https://example.com/",
      status: "NAVIGATING"
    } as unknown as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);

    await expect(
      scanService.failScan(scanId, "   ")
    ).rejects.toThrow("Error message is required");

    expect(
      scanRepository.updateFailure
    ).not.toHaveBeenCalled();
  });

  it("rejects an invalid scan status transition", async () => {
    const mockScan = {
      _id: scanId,
      url: "https://example.com/",
      status: "STARTING"
    } as unknown as IScan;

    scanRepository.findById.mockResolvedValue(mockScan);

    await expect(
      scanService.updateScanStatus(
        scanId,
        "COMPLETED"
      )
    ).rejects.toThrow(
      "Invalid scan status transition: STARTING -> COMPLETED"
    );

    expect(
      scanRepository.updateStatus
    ).not.toHaveBeenCalled();
  });
});