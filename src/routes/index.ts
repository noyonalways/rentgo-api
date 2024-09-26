import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import bookingRoutes from "../modules/booking/booking.routes";
import carRoutes from "../modules/car/car.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import userRoutes from "../modules/user/user.routes";
const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/users",
    routes: userRoutes,
  },
  {
    path: "/cars",
    routes: carRoutes,
  },
  {
    path: "/bookings",
    routes: bookingRoutes,
  },
  {
    path: "/payments",
    routes: paymentRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
