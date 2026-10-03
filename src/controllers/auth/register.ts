import { User } from "@/models/user";
import { Request, Response } from "express";
import { userDto, userResponse } from "@/libs/interface";
import { ApiError } from "@/libs/apiResponse";
import { asyncHandler } from "@/middlewares/asyncHandler";

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, role } = req.body as userDto;

    if (!username || !email || !password)
      throw new ApiError("incomplete register", 400);

    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  },
);
