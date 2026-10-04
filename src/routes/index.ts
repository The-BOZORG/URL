import { Router } from "express";
import authRouter from "@/routes/auth";

const route = Router();

route.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

route.use("/auth", authRouter);

export default route;
