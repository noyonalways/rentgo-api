import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { userValidationSchema } from "../user/user.validation";
import { authController } from "./auth.controller";
import { authValidationSchema } from "./auth.validation";

const router: Router = Router();

router.post(
  "/signup",
  validateRequest(authValidationSchema.singUp),
  authController.signUp,
);

router.post(
  "/signin",
  validateRequest(authValidationSchema.singIn),
  authController.signIn,
);

router.get("/me", auth(USER_ROLE.user, USER_ROLE.admin), authController.getMe);

router.patch(
  "/update-profile",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(userValidationSchema.updateProfile),
  authController.updateProfile,
);

router.post(
  "/refresh-token",
  validateRequest(authValidationSchema.refreshToken),
  authController.generateNEwAccessToken,
);

export default router;
