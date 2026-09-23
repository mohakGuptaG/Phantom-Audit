import { Document, Model, Schema, Types, model } from "mongoose";

export const FINDING_SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
] as const;

export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

export interface IFinding extends Document {
  scanId: Types.ObjectId;
  category: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  evidence?: string;
  screenshotId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const findingSchema = new Schema<IFinding>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: FINDING_SEVERITIES,
      required: true
    },

    evidence: {
      type: String,
      trim: true
    },

    screenshotId: {
      type: Schema.Types.ObjectId,
      ref: "Screenshot"
    }
  },
  {
    timestamps: true
  }
);

export const Finding: Model<IFinding> = model<IFinding>(
  "Finding",
  findingSchema
);