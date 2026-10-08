import express from "express";

import { getMe } from "@/controllers/user/getMe";
import { getAll } from "@/controllers/user/getAll";

import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("all", authenticate, getAll);

export default router;
