import { Request, Response } from "express";
import { FindingRepository } from "../repositories/finding.repository";
import { FindingService } from "../services/finding.service";

const findingService = new FindingService(
  new FindingRepository()
);

export const getFindings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { scanId } = req.params;

    if (Array.isArray(scanId)) {
      res.status(400).json({
        error: "Invalid scan ID"
      });
      return;
    }

    const findings = await findingService.getFindingsByScanId(
      scanId
    );

    res.status(200).json({
      scanId,
      findings
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve findings";

    res.status(400).json({
      error: message
    });
  }
};