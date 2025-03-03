import { Router } from "express";
import kitchenController from "../controllers/kitchen.controller.js";
import auth from "../middleware/auth.js";
import upload from "../services/upload.js";

const router = Router();

router.post("/login", kitchenController.sendKitchenOTP);
router.post("/login/verify", kitchenController.verifyKitchenOTP);
router.post("/login-without-otp", kitchenController.loginSignupToken);
router.get("/get-kitchen-data", auth,kitchenController.getKitchenData)
router.put("/update-profile", auth, upload, kitchenController.updateKitchenProfile);
router.delete("/delete-profile-picture", auth, kitchenController.deleteKitchenProfilePhoto);
router.delete("/delete-kitchen-image", auth, kitchenController.deleteKitchenImage);

export default router;