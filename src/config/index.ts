import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().int().default(3000),
  MONGO_URI: z.string().url(),
});

export const env = envSchema.parse(process.env);
