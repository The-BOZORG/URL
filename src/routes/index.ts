import { Router } from "express";
import authRouter from "@/routes/auth";
import userRouter from "@/routes/user";

const route = Router();

route.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

route.use("/auth", authRouter);
route.use("/user", userRouter);

export default route;
