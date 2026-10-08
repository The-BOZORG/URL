import { deleteRefreshToken } from "@/libs/redisRefresh";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";
import { ApiError } from "@/utils/apiResponse";

import { Request, Response } from "express";

export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) throw new ApiError("user not found", 404);

    await deleteRefreshToken(userId);

    await User.deleteOne({ _id: userId });

    res.sendStatus(204);
  },
);
