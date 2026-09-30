import { Document, Model, Schema, Types, model } from "mongoose";

export interface IScreenshot extends Document {
  scanId: Types.ObjectId;
  pageType: string;
  filePath: string;
  capturedAt: Date;
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

    pageType: {
      type: String,
      required: true,
      trim: true
    },

    filePath: {
      type: String,
      required: true,
      trim: true
    },

    capturedAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Screenshot: Model<IScreenshot> =
  model<IScreenshot>("Screenshot", screenshotSchema);