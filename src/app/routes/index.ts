import express from "express";

import { AuthsRoutes } from "../modules/auth/auth.route";
import { ChatsRoutes } from "../modules/chats/chat.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthsRoutes,
  },
  {
    path: "/chats",
    route: ChatsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

