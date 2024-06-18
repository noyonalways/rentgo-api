import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "./../../middlewares/auth";
import { bookingController } from "./booking.controller";
import { bookingValidationSchema } from "./booking.validation";
const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(bookingValidationSchema.book),
    bookingController.book,
  );

export default router;
