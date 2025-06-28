import express from "express";
import { login, loguot, signup } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",loguot);

export default router;
