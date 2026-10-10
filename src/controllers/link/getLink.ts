import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";
import { User } from "@/models/user";

import { Request, Response } from "express";

export const getMyLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const user = await User.findById(userId)
      .select("-__v -isVerified")
      .lean()
      .exec();

    res.status(200).json({
      user,
    });
  },
);

export const getAllLinks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const links = await Link.find({ userId: req.userId })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      data: links,
    });
  },
);
