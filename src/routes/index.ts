import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import bookingRoutes from "../modules/booking/booking.routes";
import carRoutes from "../modules/car/car.routes";
const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/cars",
    routes: carRoutes,
  },
  {
    path: "/bookings",
    routes: bookingRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
