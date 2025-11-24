import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import prisma from '../../libs/prisma';

const joinPrivateChatRoom = async (userId: string, recipientId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, status: 'ACTIVE' },
  });

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId, status: 'ACTIVE' },
  });

  if (!user || !recipient) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User or recipient not found or blocked');
  }

  // Check if a private chat already exists between these users
  const existingRoom = await prisma.chatRoom.findFirst({
    where: {
      type: 'PRIVATE',
      members: {
        every: {
          userId: { in: [userId, recipientId] },
        },
      },
    },
    include: {
      members: true,
      messages: true,
    },
  });

  if (existingRoom) {
    return existingRoom; // Return existing room
  }

  // Create new private chat room
  const newRoom = await prisma.chatRoom.create({
    data: {
      type: 'PRIVATE',
      members: {
        create: [{ userId }, { userId: recipientId }],
      },
    },
    include: {
      members: true,
      messages: true,
    },
  });

  return newRoom;
};

export const ChatsServices = { joinPrivateChatRoom };
