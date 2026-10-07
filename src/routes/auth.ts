import express from "express";

import { register } from "@/controllers/auth/register";
import { login } from "@/controllers/auth/login";
import { refresh } from "@/controllers/auth/refresh";
import { logout } from "@/controllers/auth/logout";

import { zodValidate } from "@/middlewares/zodValidator";
import { LoginSchema, RegisterSchema } from "@/libs/validateSchema";

const router = express.Router();

router.post("/register", zodValidate(RegisterSchema), register);
router.post("/login", zodValidate(LoginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
