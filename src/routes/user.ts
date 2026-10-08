import express from "express";

import { getMe } from "@/controllers/user/getMe";
import { getAll } from "@/controllers/user/getAll";
import { update } from "@/controllers/user/update";
import { updatePassword } from "@/controllers/user/updtaePass";
import { deleteUser } from "@/controllers/user/delete";

import { authenticate } from "@/middlewares/authenticate";

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/all", authenticate, getAll);
router.patch("/update", authenticate, update);
router.patch("/updatePassword", authenticate, updatePassword);
router.delete("/delete", authenticate, deleteUser);

export default router;
