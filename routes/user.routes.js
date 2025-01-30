import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.post("/login", userController.sendUserOTP);
router.post("/login/verify", userController.verifyUserOTP);
router.post("/login-without-opt", userController.loginSignupToken);

export default router;