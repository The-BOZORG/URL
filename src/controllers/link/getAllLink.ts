import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";

import { Request, Response } from "express";

export const getAllLinks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [links, total] = await Promise.all([
      Link.find()
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),

      Link.countDocuments().exec(),
    ]);

    res.status(200).json({
      data: links,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
);
