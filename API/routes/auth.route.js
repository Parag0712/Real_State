import { Router } from "express";
import { register } from "../controllers/auth.controllers.js";
const router = Router();

router.route("/register").get(register)

export default router;