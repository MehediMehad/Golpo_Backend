import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatsServices } from './chat.service';

const createPrivateChatRoom = catchAsync(async (req: Request, res: Response) => {
    // const userId = req.user.id;
    const { userId, recipientId, } = req.body;

    const chatRoom = await ChatsServices.createPrivateChatRoom(userId, recipientId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Private chat room created or retrieved successfully',
        data: chatRoom,
    });
});

export const ChatsControllers = {
    createPrivateChatRoom,
};