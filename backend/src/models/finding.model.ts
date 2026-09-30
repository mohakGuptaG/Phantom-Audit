import { Document, Model, Schema, Types, model } from "mongoose";

export const FINDING_SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
] as const;

export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IFinding extends Document {
  scanId: Types.ObjectId;
  patternType: string;
  severity: FindingSeverity;
  confidence?: number;
  description: string;
  pageType?: string;
  screenshotId?: Types.ObjectId;
  boundingBox?: BoundingBox;
  evidence?: string;
  createdAt: Date;
  updatedAt: Date;
}

const boundingBoxSchema = new Schema<BoundingBox>(
  {
    x: {
      type: Number,
      required: true,
      min: 0
    },

    y: {
      type: Number,
      required: true,
      min: 0
    },

    width: {
      type: Number,
      required: true,
      min: 0
    },

    height: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const findingSchema = new Schema<IFinding>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true
    },

    patternType: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: String,
      enum: FINDING_SEVERITIES,
      required: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    pageType: {
      type: String,
      trim: true
    },

    screenshotId: {
      type: Schema.Types.ObjectId,
      ref: "Screenshot"
    },

    boundingBox: {
      type: boundingBoxSchema
    },

    evidence: {
      type: String,
      trim: true
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