import { createClient } from "redis";
import { env } from "@/config";
import "colors";

export const client = createClient({ url: env.REDIS_URL });

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Redis connected".bgGreen);
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export const disconnectRedis = async () => {
  await client.quit();
  console.log("Redis disconnected".bgRed);
};
