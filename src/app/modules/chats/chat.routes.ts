import express from 'express';

import { ChatsControllers } from './chat.controller';
import { ChatsValidations } from './chat.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/join-private-room',
  auth('USER'),
  validateRequest(ChatsValidations.createPrivateChatRoomSchema),
  ChatsControllers.joinPrivateChatRoom,
);

export const ChatsRoutes = router;
