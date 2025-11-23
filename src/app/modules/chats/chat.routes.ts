import type { NextFunction, Request, Response } from 'express';
import express from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ChatsControllers } from './chat.controller';
import { ChatsValidations } from './chat.validation';

const router = express.Router();


router.post(
    '/create-private-room',
    // auth("USER"),
    validateRequest(ChatsValidations.createPrivateChatRoomSchema),
    ChatsControllers.createPrivateChatRoom,
);

export const ChatsRoutes = router;