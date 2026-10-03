import express from "express";

import authRouter from "@/routes/auth";

const route = express.Router();

route.use("/auth", authRouter);

export default route;
