import z from 'zod';

const createPrivateChatRoomSchema = z.object({
  recipientId: z.string().min(2, 'recipientId is required'),
});

export const ChatsValidations = {
  createPrivateChatRoomSchema,
};
