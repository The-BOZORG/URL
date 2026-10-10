import { Router } from "express";
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

route.use("/auth", authRouter);
route.use("/user", userRouter);
route.use("/link", linkRouter);

export default route;
