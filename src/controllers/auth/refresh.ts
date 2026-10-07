import { Request, Response } from "express";
import { ApiError } from "@/utils/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { verifyRefresh, generateAccess } from "@/libs/jwt";
import { Types } from "mongoose";
import { getRefreshToken } from "@/libs/redisRefresh";

export const refresh = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.signedCookies.refreshToken;

    if (!refreshToken) throw new ApiError("authenticate error", 401);

    const payload = verifyRefresh(refreshToken) as {
      userId: Types.ObjectId;
    };

    const storedToken = await getRefreshToken(payload.userId);

    if (!storedToken || storedToken !== refreshToken)
      throw new ApiError("Invalid refresh token", 401);

    const accessToken = generateAccess(payload.userId);

    res.status(200).json({
      accessToken,
    });
  },
);
