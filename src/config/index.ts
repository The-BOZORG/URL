import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().int().default(3000),
  WHITELIST: z.string().email(),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRY: z.coerce.number().int().positive(),
  JWT_REFRESH_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRY: z.coerce.number().int().positive(),
});

export const env = envSchema.parse(process.env);
