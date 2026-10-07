import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "@/utils/apiResponse";
import { verifyAccess } from "@/libs/jwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer "))
    throw new ApiError("Access token is required", 401);

  const token = authorization.split(" ")[1];

  if (!token) throw new ApiError("Access token is required", 401);

  try {
    const payload = verifyAccess(token) as {
      userId: Types.ObjectId;
    };

    req.userId = payload.userId;

    return next();
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      throw new ApiError("Invalid or expired access token", 401);
    }
    throw error;
  }
};
