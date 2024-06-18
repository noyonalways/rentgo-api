import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
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

export default router;
