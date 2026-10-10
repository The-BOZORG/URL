import express from "express";

import { createLink } from "@/controllers/link/createLink";
import { deleteLink } from "@/controllers/link/deleteLink";
import { getMyLink } from "@/controllers/link/getLink";
import { getAllLinks } from "@/controllers/link/getAllLink";

import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorization";

import { zodValidate } from "@/middlewares/zodValidator";
import { CreateLinkSchema } from "@/libs/validateSchema";

const route = express.Router();

route.get("/myLink", authenticate, getMyLink);

route.get("/all", authenticate, authorize(["admin"]), getAllLinks);

route.post("/create", authenticate, zodValidate(CreateLinkSchema), createLink);

route.delete("/delete/:LinkId", authenticate, deleteLink);

export default route;
