import express from "express";

import { register } from "@/controllers/auth/register";
import { zodValidate } from "@/middlewares/zodValidator";
import { RegisterSchema } from "@/utils/validateSchema";

const router = express.Router();

router.post("/register", zodValidate(RegisterSchema), register);

export default router;
