import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { USER_ROLE } from "../user/user.constant";
import { paymentController } from "./payment.controller";
import { paymentValidationSchema } from "./payment.validation";
const router: Router = Router();

router.post(
  "/pay",
  auth(USER_ROLE.user),
  validateRequest(paymentValidationSchema.payPayment),
  paymentController.payPayment,
);

// check the payment confirmation
router.post("/confirmation", paymentController.paymentConfirmation);

// payment failed
router.post("/failed", paymentController.paymentFailed);

// payment cancelled
router.get("/cancelled", paymentController.paymentCancelled);

export default router;
