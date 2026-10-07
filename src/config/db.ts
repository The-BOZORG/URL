import mongoose from "mongoose";
import { env } from "@/config";
import { ApiError } from "@/utils/apiResponse";
import "colors";

export const connectToDatabase = async (): Promise<void> => {
  if (!env.MONGO_URI)
    throw new ApiError("MongoDB URI is not defined in the config", 500);

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected successfully".bgGreen, {
      uri: env.MONGO_URI,
    });
  } catch (error) {
    console.error("Error connecting to database", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed".bgRed);
  } catch (error) {
    console.log("Error disconnect form database", error);
  }
};
