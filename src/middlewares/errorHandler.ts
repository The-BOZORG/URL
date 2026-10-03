import { ApiError } from "@/libs/apiResponse";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
};
