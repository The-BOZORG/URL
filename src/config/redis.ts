import { createClient } from "redis";
import "colors";

export const client = createClient();

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

export const connectRedis = async () => {
  await client.connect();
  console.log("Redis connected".bgGreen);
};

export const disconnectRedis = async () => {
  await client.quit();
  console.log("Redis disconnected".bgRed);
};
