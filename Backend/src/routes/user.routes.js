import { Router } from "express";
import { getmyprofile, loginUser, logoutUser, registerUser, uploadAvatar, verifyEmail } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser);
router.route("/upload-avatar").patch(verifyToken, upload.single("avatar"), uploadAvatar);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/me").get(verifyToken, getmyprofile);
router.route("/verify-email").post(verifyEmail);

export default router