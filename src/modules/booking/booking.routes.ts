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

// get logged in user's bookings
router.get(
  "/my-bookings",
  auth(USER_ROLE.user),
  bookingController.getUserBookings,
);

// get single booking by transaction id
router.get(
  "/my-bookings/:transactionId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  bookingController.getBookingByTransactionId,
);

// cancel a booking (logged in user)
router.delete(
  "/my-bookings/:id",
  auth(USER_ROLE.user),
  bookingController.cancelLoggedInUserBooking,
);

// update a booking (logged in user)
router.patch(
  "/my-bookings/:id",
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchema.updateBooking),
  bookingController.updateLoggedInUserBooking,
);

// approved booking for admin
router.patch(
  "/:id/approved",
  auth(USER_ROLE.admin),
  bookingController.approvedBooking,
);

// cancelled booking for admin
router.patch(
  "/:id/cancelled",
  auth(USER_ROLE.admin),
  bookingController.cancelledBooking,
);

export default router;
