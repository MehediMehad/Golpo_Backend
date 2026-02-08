import type { ChatRoomType } from '@prisma/client';
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
const getUserRoomIds = async (userId: string) => {
  const rooms = await prisma.chatRoomMember.findMany({
    where: { userId },
    select: { chatRoomId: true },
  });

  return rooms.map((r) => r.chatRoomId);
};

const getChatRoomsByUserId = async (userId: string, type?: ChatRoomType) => {
  const rooms = await prisma.chatRoomMember.findMany({
    where: {
      userId,
      isLeft: false,
      isArchived: false,
      chatRoom: {
        type,
      },
    },
    select: {
      unreadCount: true,
      isMuted: true,
      chatRoom: {
        select: {
          id: true,
          type: true,
          name: true,
          image: true,
          lastMessage: true,
          lastMessageAt: true,
          updatedAt: true,

          members: {
            where: {
              userId: { not: userId },
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              content: true,
              type: true,
              createdAt: true,
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
              readBy: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      chatRoom: {
        updatedAt: 'desc',
      },
    },
  });

  const formattedRooms = rooms.map((room) => {
    const chat = room.chatRoom;

    const participants = chat.members.map((m) => m.user);

    const isGroup = chat.type === 'GROUP';

    return {
      roomId: chat.id,
      type: chat.type,

      title: isGroup ? chat.name : participants[0]?.name,

      image: isGroup ? chat.image : participants[0]?.image,

      participants,
      unreadCount: room.unreadCount,
      isMuted: room.isMuted,
      updatedAt: chat.updatedAt,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      reads: chat.messages[0]?.readBy || [],
    };
  });

  return {
    count: formattedRooms.length,
    rooms: formattedRooms,
  };
};

export const ChatsServices = {
  joinPrivateChatRoom,
  getUserRoomIds,
  getChatRoomsByUserId,
};
