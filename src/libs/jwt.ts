import jwt from "jsonwebtoken";
import { env } from "@/config";

import { Types } from "mongoose";
import { Response } from "express";

export const generateAccess = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
    subject: "accessToken",
  });
};

export const generateRefresh = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
    subject: "refreshToken",
  });
};

export const verifyAccess = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefresh = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

export const attachCookie = (res: Response, userId: Types.ObjectId): void => {
  const token = generateRefresh(userId);

  const sevenDays = 1000 * 60 * 60 * 24 * 7;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + sevenDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
