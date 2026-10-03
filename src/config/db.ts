import { MongoClient } from "mongodb";
import { env } from "@/config";
import "colors";

const client = new MongoClient(env.MONGO_URI);

export async function connectToDatabase() {
  await client.connect();

  console.log("MongoDB connected successfully".bgGreen);
}

export async function disconnectFromDatabase() {
  await client.close();

  console.log("MongoDB connection closed".bgRed);
}
