import express from "express";

import { register } from "@/controllers/auth/register";
import { login } from "@/controllers/auth/login";

import { zodValidate } from "@/middlewares/zodValidator";
import { RegisterSchema } from "@/utils/validateSchema";

const router = express.Router();

router.post("/register", zodValidate(RegisterSchema), register);
router.post("/login", login);

export default router;
