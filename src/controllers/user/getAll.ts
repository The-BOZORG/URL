import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";

import { Request, Response } from "express";

export const getAll = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const total = await User.countDocuments();
    const users = await User.find()
      .select("-__v")
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  },
);
