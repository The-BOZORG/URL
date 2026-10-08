import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";
import { ApiError } from "@/utils/apiResponse";

import { Request, Response } from "express";

export const update = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { username, email } = req.body;

    const user = await User.findById(userId).select("-__v -isVerified").exec();

    if (!user) throw new ApiError("user not found", 404);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      user,
    });
  },
);
