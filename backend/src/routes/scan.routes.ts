import { Router } from "express";
import {
  createScan,
  getScan,
  getScanProgress,
  updateScanStatus
} from "../controllers/scan.controller";

const router = Router();

router.post("/", createScan);
router.get("/:scanId/progress", getScanProgress);
router.patch("/:scanId/status", updateScanStatus);
router.get("/:scanId", getScan);

export default router;