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
    status: ScanStatus,
    timestamps?: {
      startedAt?: Date;
      completedAt?: Date;
    }
  ): Promise<IScan | null> {
    return Scan.findByIdAndUpdate(
      scanId,
      {
        status,
        ...timestamps
      },
      {
        new: true,
        runValidators: true
      }
    );
  }

  async updateFailure(
    scanId: string,
    errorMessage: string
  ): Promise<IScan | null> {
    return Scan.findByIdAndUpdate(
      scanId,
      {
        status: "FAILED",
        errorMessage
      },
      {
        new: true,
        runValidators: true
      }
    );
  }
}