import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";
import { ApiError } from "@/utils/apiResponse";
import { Request, Response } from "express";

export const redirectLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const shortLink = req.params.shortLink;

    const link = await Link.findOne({ shortLink });

    if (!link) throw new ApiError("Link not found", 404);

    link.views += 1;
    await link.save();

    res.redirect(302, link.Url);
  },
);
