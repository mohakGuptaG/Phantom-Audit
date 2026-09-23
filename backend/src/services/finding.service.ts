import mongoose from "mongoose";
import { IFinding } from "../models/finding.model";
import { FindingRepository } from "../repositories/finding.repository";

export class FindingService {
  constructor(
    private readonly findingRepository: FindingRepository
  ) {}

  async getFindingsByScanId(scanId: string): Promise<IFinding[]> {
    if (!mongoose.isValidObjectId(scanId)) {
      throw new Error("Invalid scan ID");
    }

    return this.findingRepository.findByScanId(scanId);
  }
}