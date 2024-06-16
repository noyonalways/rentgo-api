import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidationSchema } from "./auth.validation";
const router: Router = Router();

router.post("/signup", validateRequest(authValidationSchema.singUp));

export default router;
