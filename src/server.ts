import "colors";

import app from "@/index";
import { env } from "@/config";

import { connectToDatabase, disconnectFromDatabase } from "@/config/db";
import { connectRedis, disconnectRedis } from "@/config/redis";

async function Boot() {
  await connectToDatabase();
  await connectRedis();

  app.listen(env.PORT, () => {
    console.log(`Server Running On http://localhost:${env.PORT}`.cyan.bold);
  });
}

process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  await disconnectRedis();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectFromDatabase();
  await disconnectRedis();
  process.exit(0);
});

Boot();
