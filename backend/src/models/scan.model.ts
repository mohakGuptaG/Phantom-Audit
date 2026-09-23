import { Document, Model, Schema, model } from "mongoose";

export const SCAN_STATUSES = [
  "CREATED",
  "STARTING",
  "NAVIGATING",
  "CAPTURING",
  "ANALYZING",
  "SCORING",
  "COMPLETED",
  "FAILED",
  "CANCELLED"
] as const;

export type ScanStatus = (typeof SCAN_STATUSES)[number];

export interface IScan extends Document {
  url: string;
  status: ScanStatus;
  score?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const scanSchema = new Schema<IScan>(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: SCAN_STATUSES,
      required: true,
      default: "CREATED"
    },

    score: {
      type: Number,
      min: 0,
      max: 100
    },

    error: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Scan: Model<IScan> = model<IScan>("Scan", scanSchema);