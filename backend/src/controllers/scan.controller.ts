import { Request, Response } from "express";
import {
  SCAN_STATUSES,
  ScanStatus
} from "../models/scan.model";
import { ScanRepository } from "../repositories/scan.repository";
import { ScanService } from "../services/scan.service";

const scanService = new ScanService(new ScanRepository());

const isScanStatus = (value: unknown): value is ScanStatus => {
  return (
    typeof value === "string" &&
    SCAN_STATUSES.includes(value as ScanStatus)
  );
};

export const createScan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { url } = req.body;

    const scan = await scanService.createScan(url);

    res.status(201).json({
      scanId: scan._id,
      url: scan.url,
      status: scan.status,
      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create scan";

    res.status(400).json({
      error: message
    });
  }
};

export const getScan = async (
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

    const scan = await scanService.getScan(scanId);

    if (!scan) {
      res.status(404).json({
        error: "Scan not found"
      });
      return;
    }

    res.status(200).json(scan);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve scan";

    res.status(400).json({
      error: message
    });
  }
};

export const getScanProgress = async (
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

    const scan = await scanService.getScan(scanId);

    if (!scan) {
      res.status(404).json({
        error: "Scan not found"
      });
      return;
    }

    res.status(200).json({
      scanId: scan._id,
      status: scan.status
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve scan progress";

    res.status(400).json({
      error: message
    });
  }
};

export const updateScanStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { scanId } = req.params;
    const { status } = req.body;

    if (Array.isArray(scanId)) {
      res.status(400).json({
        error: "Invalid scan ID"
      });
      return;
    }

    if (!isScanStatus(status)) {
      res.status(400).json({
        error: "Invalid scan status"
      });
      return;
    }

    const scan = await scanService.updateScanStatus(
      scanId,
      status
    );

    res.status(200).json({
      scanId: scan._id,
      status: scan.status,
      updatedAt: scan.updatedAt
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update scan status";

    res.status(400).json({
      error: message
    });
  }
};