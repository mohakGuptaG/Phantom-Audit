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

describe("FindingService", () => {
  let findingService: FindingService;
  let findingRepository: jest.Mocked<FindingRepository>;

  beforeEach(() => {
    findingRepository = {
      create: jest.fn(),
      findByScanId: jest.fn()
    } as unknown as jest.Mocked<FindingRepository>;

    findingService = new FindingService(findingRepository);
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

    findingRepository.create.mockResolvedValue(mockFinding);

    const result = await findingService.createFinding({
      scanId: "6ab40f2a31d9796493ee8357",
      category: " TEST ",
      title: " Test finding ",
      description: " Test description ",
      severity: "LOW",
      evidence: " Test evidence "
    });

    expect(findingRepository.create).toHaveBeenCalledWith({
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

    expect(findingRepository.create).not.toHaveBeenCalled();
  });

  it("rejects an invalid severity", async () => {
    await expect(
      findingService.createFinding({
        scanId: "6ab40f2a31d9796493ee8357",
        category: "TEST",
        title: "Test finding",
        description: "Test description",
        severity: "INVALID" as never
      })
    ).rejects.toThrow("Invalid finding severity");

    expect(findingRepository.create).not.toHaveBeenCalled();
  });
});