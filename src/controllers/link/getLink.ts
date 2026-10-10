import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";
import { User } from "@/models/user";

import { Request, Response } from "express";

export const getMyLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const {
      search = "",
      sortby = "createdAt_desc",
      offset = 0,
      limit = 100,
    } = req.query;

    const user = await User.findById(userId)
      .select("-__v -isVerified")
      .lean()
      .exec();

    res.status(200).json({
      user,
    });
  },
);
