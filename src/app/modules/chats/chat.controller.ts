import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { ChatsServices } from './chat.service';
import catchAsync from '../../helpers/catchAsync';
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

export const ChatsControllers = {
  joinPrivateChatRoom,
};
