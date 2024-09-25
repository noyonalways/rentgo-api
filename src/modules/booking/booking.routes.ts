import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { USER_ROLE } from "../user/user.constant";
import { bookingController } from "./booking.controller";
import { bookingValidationSchema } from "./booking.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.user),
    validateRequest(bookingValidationSchema.newBooking),
    bookingController.newBooking,
  )
  .get(auth(USER_ROLE.admin), bookingController.getAllBookings);

router.get(
  "/my-bookings",
  auth(USER_ROLE.user),
  bookingController.getUserBookings,
);

// approved booking
router.patch(
  "/:id/approved",
  auth(USER_ROLE.admin),
  bookingController.approvedBooking,
);

// cancelled booking
router.patch(
  "/:id/cancelled",
  auth(USER_ROLE.admin),
  bookingController.cancelledBooking,
);

export default router;
