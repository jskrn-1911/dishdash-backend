import { Router } from "express";
import kitchenController from "../controllers/kitchen.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/login", kitchenController.sendKitchenOTP);
router.post("/login/verify", kitchenController.verifyKitchenOTP);
router.post("/login-without-opt", kitchenController.loginSignupToken);
router.put("/update-profile/:kitchenId", auth, kitchenController.updateKitchenProfile);

export default router;