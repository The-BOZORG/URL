import { Router } from "express";

import { authLimiter, globalLimiter } from "@/libs/rateLimiter";

import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";
import linkRouter from "@/routes/link";

const route = Router();

route.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

route.use("/auth", authLimiter, authRouter);
route.use("/user", globalLimiter, userRouter);
route.use("/link", globalLimiter, linkRouter);

export default route;
