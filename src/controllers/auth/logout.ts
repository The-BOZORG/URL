import { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/asyncHandler";

export const logout = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });

    res.sendStatus(204);
  },
);
