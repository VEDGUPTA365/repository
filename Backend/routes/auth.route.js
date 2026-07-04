import express from "express";
import { checkAuthController, loginController, logoutController, signupController, deleteUserAccount } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuthController);
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.delete("/delete-account", verifyToken, deleteUserAccount);

export default router;