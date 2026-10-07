import { User } from "@/models/user";
import { Request, Response } from "express";
import { loginDto } from "@/utils/interface";
import { ApiError } from "@/utils/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { attachCookie, generateAccess } from "@/libs/jwt";

import bcrypt from "bcrypt";
import { saveRefreshToken } from "@/libs/redisRefresh";
import { env } from "@/config";

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

    const refreshToken = attachCookie(res, user._id);

    await saveRefreshToken(
      user._id.toString(),
      refreshToken,
      env.REFRESH_TOKEN_EXPIRY,
    );

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
