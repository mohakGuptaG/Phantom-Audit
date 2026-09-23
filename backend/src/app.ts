import express from "express";
import cors from "cors";

import scanRoutes from "./routes/scan.routes";
import findingRoutes from "./routes/finding.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "phantom-audit-backend"
  });
});

app.use("/api/scans", scanRoutes);
app.use("/api/scans", findingRoutes);

export default app;