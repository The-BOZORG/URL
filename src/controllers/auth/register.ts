import { User } from "@/models/user";
import { Request, Response } from "express";
import { registerDto } from "@/libs/interface";
import { ApiError } from "@/libs/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";
import { env } from "@/config";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body as registerDto;

    const existingUser = await User.findOne({ email })
      .select("username email role")
      .lean()
      .exec();

    if (existingUser) throw new ApiError("User already exists", 400);

    const role = env.WHITELIST.includes(email) ? "admin" : "user";

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User created success",
      data: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  },
);
