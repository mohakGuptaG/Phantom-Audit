import { Document, Model, Schema, Types, model } from "mongoose";

export interface IScreenshot extends Document {
  scanId: Types.ObjectId;
  storageKey: string;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const screenshotSchema = new Schema<IScreenshot>(
  {
    scanId: {
      type: Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true
    },

    storageKey: {
      type: String,
      required: true,
      trim: true
    },

    mimeType: {
      type: String,
      required: true,
      trim: true
    },

    width: {
      type: Number,
      min: 1
    },

    height: {
      type: Number,
      min: 1
    }
  },
  {
    timestamps: true
  }
);

export const Screenshot: Model<IScreenshot> =
  model<IScreenshot>("Screenshot", screenshotSchema);