import { Scan, IScan, ScanStatus } from "../models/scan.model";

export class ScanRepository {
  async create(url: string): Promise<IScan> {
    return Scan.create({
      url,
      status: "CREATED"
    });
  }

  async findById(scanId: string): Promise<IScan | null> {
    return Scan.findById(scanId);
  }

  async updateStatus(
    scanId: string,
    status: ScanStatus
  ): Promise<IScan | null> {
    return Scan.findByIdAndUpdate(
      scanId,
      { status },
      { new: true, runValidators: true }
    );
  }

  async updateFailure(
    scanId: string,
    error: string
  ): Promise<IScan | null> {
    return Scan.findByIdAndUpdate(
      scanId,
      {
        status: "FAILED",
        error
      },
      { new: true, runValidators: true }
    );
  }
}