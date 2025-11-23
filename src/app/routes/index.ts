import express from 'express';

import { UsersRoutes } from '../modules/users/users.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UsersRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
