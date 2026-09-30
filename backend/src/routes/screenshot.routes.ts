import { Router } from "express";
import { getScreenshot } from "../controllers/screenshot.controller";

const router = Router();

router.get(
  "/:scanId/screenshots/:screenshotId",
  getScreenshot
);

export default router;