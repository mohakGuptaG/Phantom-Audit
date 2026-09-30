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
  errorMessage?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
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

    errorMessage: {
      type: String,
      trim: true
    },

    startedAt: {
      type: Date
    },

    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Scan: Model<IScan> = model<IScan>("Scan", scanSchema);