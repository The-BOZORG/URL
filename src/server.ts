import "colors";

import app from "@/index";
import { env } from "@/config";

import { connectToDatabase, disconnectFromDatabase } from "@/config/db";

async function Boot() {
  await connectToDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server Running On http://localhost:${env.PORT}`.cyan.bold);
  });
}

process.on("SIGINT", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

Boot();
