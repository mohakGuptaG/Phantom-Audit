import {
  describe,
  beforeAll,
  afterAll,
  afterEach,
  it,
  expect
} from "@jest/globals";

import mongoose from "mongoose";
import { env } from "../src/config/env";
import { Scan } from "../src/models/scan.model";

describe("Scan MongoDB persistence", () => {
  let createdScanId: mongoose.Types.ObjectId | null = null;

  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    if (createdScanId) {
      await Scan.deleteOne({
        _id: createdScanId
      });

      createdScanId = null;
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("persists and retrieves a scan from MongoDB", async () => {
    const scan = await Scan.create({
      url: "https://example.com/",
      status: "CREATED"
    });

    createdScanId = scan._id;

    expect(scan._id).toBeDefined();
    expect(scan.url).toBe("https://example.com/");
    expect(scan.status).toBe("CREATED");

    const persistedScan = await Scan.findById(
      scan._id
    );

    expect(persistedScan).not.toBeNull();
    expect(persistedScan?.url).toBe(
      "https://example.com/"
    );
    expect(persistedScan?.status).toBe("CREATED");
  });
});