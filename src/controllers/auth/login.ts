import { User } from "@/models/user";
import { Request, Response } from "express";
import { loginDto } from "@/libs/interface";
import { ApiError } from "@/libs/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { attachCookie, generateAccess } from "@/libs/jwt";

import bcrypt from "bcrypt";

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as loginDto;

    const user = await User.findOne({ email })
      .select("email password username role ")
      .exec();

    if (!user) throw new ApiError("User already exists", 400);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw new ApiError("Invalid login", 400);

    user.isVerified = true;
    await user.save();

    const accessToken = generateAccess(user._id);

    attachCookie(res, user._id);

    res.status(200).json({
      accessToken,
      data: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  },
);
