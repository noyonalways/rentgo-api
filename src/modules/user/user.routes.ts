import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { USER_ROLE } from "./user.constant";
import { userController } from "./user.controller";
import { userValidationSchema } from "./user.validation";

const router: Router = Router();

router.patch(
  "/:id/change-status",
  auth(USER_ROLE.admin),
  validateRequest(userValidationSchema.changeStatus),
  userController.changeStatus,
);

export default router;
