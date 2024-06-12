import { Router } from "express";
const router: Router = Router();

const moduleRoutes = [
  {
    path: "/",
    routes: homeRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
