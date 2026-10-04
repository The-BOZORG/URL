import { User } from "@/models/user";
import { Request, Response } from "express";
import { userDto } from "@/libs/interface";
import { ApiError } from "@/libs/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body as userDto;

    const existingUser = await User.findOne({ email })
      .select("username email password role")
      .lean()
      .exec();

    if (existingUser) throw new ApiError("User already exists", 400);

    const newUser = await User.create({
      username,
      email,
      password,
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
