import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const zodValidate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);

      return res.status(400).json({
        message: messages.join(", "),
      });
    }

    req.body = result.data;
    next();
  };
};
