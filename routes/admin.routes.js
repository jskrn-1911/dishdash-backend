import { Router } from "express";
import upload from "../services/upload.js";
import middleware from "../middleware/auth.js";
import adminController from "../controllers/admin.controller.js";

const router = Router();

router.post("/signup", upload, adminController.signupHandler);
router.post("/login", adminController.loginHandler);
router.put("/update-admin-profile", middleware, upload, adminController.updateAdminProfile);

export default router;