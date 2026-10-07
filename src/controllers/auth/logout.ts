import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { deleteRefreshToken } from "@/libs/redisRefresh";

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    await deleteRefreshToken(userId);

    res.clearCookie("refreshToken", {
      httpOnly: true,
    });

    res.sendStatus(204);
  },
);
