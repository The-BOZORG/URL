import { client } from "@/config/redis";

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
  expiry: number,
): Promise<void> => {
  await client.set(`refreshToken:${userId}`, refreshToken, {
    EX: expiry,
  });
};

export const getRefreshToken = async (
  userId: string,
): Promise<string | null> => {
  return client.get(`refreshToken:${userId}`);
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
  await client.del(`refreshToken:${userId}`);
};
