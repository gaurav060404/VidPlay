import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAcessToken, updateUserAvatar } from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAcessToken);

router.route("/update-avatar").patch(upload.single("avatar"),verifyJWT,updateUserAvatar);

export default router;
