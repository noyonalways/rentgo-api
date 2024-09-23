import { Router } from "express";
import { auth, validateRequest } from "../../middlewares";
import { USER_ROLE } from "../user/user.constant";
import { carController } from "./car.controller";
import { carValidationSchema } from "./car.validation";

const router: Router = Router();

router
  .route("/")
  .post(
    auth(USER_ROLE.admin),
    validateRequest(carValidationSchema.create),
    carController.create,
  )
  .get(carController.getAll);

router.put(
  "/return",
  auth(USER_ROLE.admin),
  validateRequest(carValidationSchema.returnTheCar),
  carController.returnTheCar,
);

router
  .route("/:id")
  .get(carController.getSingle)
  .put(
    auth(USER_ROLE.admin),
    validateRequest(carValidationSchema.update),
    carController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), carController.deleteSingle);

export default router;
