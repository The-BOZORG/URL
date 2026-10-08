import express from "express";

import { getMe } from "@/controllers/user/getMe";
import { getAll } from "@/controllers/user/getAll";
import { update } from "@/controllers/user/update";
import { updatePassword } from "@/controllers/user/updtaePass";
import { deleteUser } from "@/controllers/user/delete";

import { authenticate } from "@/middlewares/authenticate";
import { authorize } from "@/middlewares/authorization";

import { zodValidate } from "@/middlewares/zodValidator";
import { updatePasswordSchema, updateSchema } from "@/libs/validateSchema";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/all", authenticate, authorize(["admin"]), getAll);
router.patch("/update", authenticate, zodValidate(updateSchema), update);
router.patch(
  "/updatePassword",
  authenticate,
  zodValidate(updatePasswordSchema),
  updatePassword,
);
router.delete("/delete", authenticate, deleteUser);

export default router;
