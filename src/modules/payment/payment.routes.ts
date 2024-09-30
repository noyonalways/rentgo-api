import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { USER_ROLE } from "../user/user.constant";
import { paymentController } from "./payment.controller";
import { paymentValidationSchema } from "./payment.validation";
const router: Router = Router();

// get all payments (admin only)
router.get("/", auth(USER_ROLE.admin), paymentController.getAllPayments);

// get total revenue (admin only)
router.get(
  "/total-revenue",
  auth(USER_ROLE.admin),
  paymentController.getTotalRevenue,
);

router.post(
  "/pay",
  auth(USER_ROLE.user),
  validateRequest(paymentValidationSchema.payPayment),
  paymentController.payPayment,
);

// logged in user payment history
router.get(
  "/my-payments",
  auth(USER_ROLE.user),
  paymentController.userPayments,
);

// check the payment confirmation
router.post("/confirmation", paymentController.paymentConfirmation);

// payment failed
router.post("/failed", paymentController.paymentFailed);

// payment cancelled
router.get("/cancelled", paymentController.paymentCancelled);

export default router;
