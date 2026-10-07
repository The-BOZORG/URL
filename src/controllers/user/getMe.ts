import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";

import { Request, Response } from "express";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await User.findById(userId)
    .select("-__v -isVerified")
    .lean()
    .exec();

  res.status(200).json({
    user,
  });
});
