import { Router } from "express";
import { getFindings } from "../controllers/finding.controller";

const router = Router();

router.get("/:scanId/findings", getFindings);

export default router;