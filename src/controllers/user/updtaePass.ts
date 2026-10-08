import { asyncHandler } from "@/middlewares/asyncHandler";
import { User } from "@/models/user";
import { ApiError } from "@/utils/apiResponse";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const updatePassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("-__v +password").exec();

    if (!user) throw new ApiError("User not found", 404);

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) throw new ApiError("Invalid password", 401);

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  },
);
