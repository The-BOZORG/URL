import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";

import { Request, Response } from "express";

export const getMyLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const links = await Link.find(userId)
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      links,
    });
  },
);
