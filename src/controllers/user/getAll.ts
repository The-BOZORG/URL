import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";
import { ApiError } from "@/utils/apiResponse";

import { Request, Response } from "express";

export const getAll = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const total = await User.countDocuments();
    const users = await User.find(userId)
      .select("-__v -isVerified")
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    if (!users) throw new ApiError("user not found", 404);

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  },
);
