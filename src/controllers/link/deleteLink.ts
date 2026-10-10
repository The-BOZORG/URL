import { asyncHandler } from "@/middlewares/asyncHandler";
import { Link } from "@/models/link";
import { ApiError } from "@/utils/apiResponse";

import { Request, Response } from "express";

export const deleteLink = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { LinkId } = req.params;

    const deletedLink = await Link.findOneAndDelete({
      _id: LinkId,
      userId: userId,
    });

    if (!deletedLink) throw new ApiError("link is not available", 404);

    res.sendStatus(204);
  },
);
