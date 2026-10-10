import express from "express";

import { createLink } from "@/controllers/link/createLink";

import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorization";

import { zodValidate } from "@/middlewares/zodValidator";
import { CreateLinkSchema } from "@/libs/validateSchema";

const route = express.Router();

route.post("/create", authenticate, zodValidate(CreateLinkSchema), createLink);

export default route;
