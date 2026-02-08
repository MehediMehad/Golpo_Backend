import type { ChatRoomType } from '@prisma/client';
import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { ChatsServices } from './chat.service';
import catchAsync from '../../helpers/catchAsync';
import { pick } from '../../utils/pick';
import sendResponse from '../../utils/sendResponse';

const joinPrivateChatRoom = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { recipientId } = req.body;

  const chatRoom = await ChatsServices.joinPrivateChatRoom(userId, recipientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Joined private chat room successfully',
    data: chatRoom,
  });
});

const getChatRoomsByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const filter = pick(req.query, ['type'] as const);
  const chatRooms = await ChatsServices.getChatRoomsByUserId(
    userId,
    (filter.type as ChatRoomType) || undefined,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat rooms retrieved successfully',
    data: chatRooms,
  });
});

export const ChatsControllers = {
  joinPrivateChatRoom,
  getChatRoomsByUserId,
};
