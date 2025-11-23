import express from 'express';

import { UsersRoutes } from '../modules/users/users.route';
import { ChatsRoutes } from '../modules/chats/chat.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UsersRoutes,
  },
  {
    path: '/chats',
    route: ChatsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
