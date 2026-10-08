import { User } from "@/models/user";

import { NextFunction, Request, Response } from "express";
import { authRole } from "@/utils/interface";
import { asyncHandler } from "./asyncHandler";
import { ApiError } from "@/utils/apiResponse";

export const authorize = (roles: authRole[]) => {
  return asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.userId;

      const user = await User.findById(userId).select("role").exec();

      if (!user) throw new ApiError("User not found", 404);

      if (!roles.includes(user.role)) throw new ApiError("Access denied", 403);

      next();
    },
  );
};
