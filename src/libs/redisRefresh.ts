import { client } from "@/config/redis";
import { Types } from "mongoose";

export const saveRefreshToken = async (
  userId: Types.ObjectId,
  refreshToken: string,
  expiry: number,
): Promise<void> => {
  await client.set(`refreshToken:${userId}`, refreshToken, {
    EX: expiry,
  });
};

export const getRefreshToken = async (
  userId: Types.ObjectId,
): Promise<string | null> => {
  return client.get(`refreshToken:${userId}`);
};

export const deleteRefreshToken = async (
  userId: Types.ObjectId,
): Promise<void> => {
  await client.del(`refreshToken:${userId}`);
};
