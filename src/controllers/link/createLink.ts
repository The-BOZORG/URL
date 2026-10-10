import { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";
import { randomBytes } from "node:crypto";

export const createLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { Url } = req.body;

    const link = await Link.create({
      creator: userId,
      Url,
      shortLink: randomBytes(6).toString("base64url"),
    });

    res.status(201).json({
      message: "Link created successfully",
      data: link,
    });
  },
);
