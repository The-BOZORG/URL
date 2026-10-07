import express from "express";

import { getMe } from "@/controllers/user/getMe";
import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.get("/me", authenticate, getMe);

export default router;
