import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "./../../middlewares/auth";
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
  .get(auth(USER_ROLE.admin, USER_ROLE.user), carController.getAll);

router.put(
  "/return",
  auth(USER_ROLE.admin),
  validateRequest(carValidationSchema.returnTheCar),
  carController.returnTheCar,
);

router
  .route("/:id")
  .get(auth(USER_ROLE.admin, USER_ROLE.user), carController.getSingle)
  .put(
    auth(USER_ROLE.admin),
    validateRequest(carValidationSchema.update),
    carController.updateSingle,
  )
  .delete(auth(USER_ROLE.admin), carController.deleteSingle);

export default router;
