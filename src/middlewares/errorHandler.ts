import { ApiError } from "@/utils/apiResponse";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return res.status(409).json({
      message: "This value already exists",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID or value",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
};
