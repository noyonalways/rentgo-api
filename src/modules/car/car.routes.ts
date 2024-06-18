import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { carController } from "./car.controller";
import { carValidationSchema } from "./car.validation";
const router: Router = Router();

router
  .route("/")
  .post(validateRequest(carValidationSchema.create), carController.create)
  .get(carController.getAll);

router
  .route("/:id")
  .get(carController.getSingle)
  .put(validateRequest(carValidationSchema.update), carController.updateSingle)
  .delete(carController.deleteSingle);

export default router;
