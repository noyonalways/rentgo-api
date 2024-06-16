import { Router } from "express";
const router: Router = Router();

const moduleRoutes = [
  {
    path: "/",
    routes: "",
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
