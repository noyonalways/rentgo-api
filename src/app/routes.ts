import { Request, Response, Router } from "express";
import mainRoutes from "../routes";
import { errorHandler } from "./errorHandler";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Hello World!",
  });
});

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is Healthy✅",
  });
});

// main routes
router.use("/api/v1", mainRoutes);

// error handlers
router.use(errorHandler.notFound);
router.use(errorHandler.global);

export default router;
