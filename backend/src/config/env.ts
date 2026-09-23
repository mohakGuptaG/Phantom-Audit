import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGODB_URI"] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI as string,
  NODE_ENV: process.env.NODE_ENV || "development"
};