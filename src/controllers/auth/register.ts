import { User } from "@/models/user";
import { Request, Response } from "express";
import { userDto, userResponse } from "@/libs/interface";
import { AppError } from "@/libs/apiResponse";

export const register = async (
  req: Request,
  res: Response,
): Promise<userResponse> => {
  const { username, email, password } = req.body as userDto;

  if (!username || !email || !password)
    throw new AppError("incomplete register", 400);
};
