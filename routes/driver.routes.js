import { Router } from "express";
import upload from "../services/upload.js";
import middleware from "../middleware/auth.js";
import driverController from "../controllers/driver.controller.js";

const router = Router();

router.post("/login", driverController.sendDriverOTP);
router.post("/login/verify", driverController.verifyDriverOTP);
router.post("/login-without-opt", driverController.loginSignupToken);
// router.put("/update-driver-profile", middleware, upload, driverController.updateDriverProfile);

export default router;