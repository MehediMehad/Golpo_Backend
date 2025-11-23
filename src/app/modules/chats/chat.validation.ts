import z from "zod";



const createPrivateChatRoomSchema = z.object({
    userId: z.string().min(2, 'userId is required'),
    recipientId: z.string().min(2, 'recipientId is required'),
});




export const ChatsValidations = {
    createPrivateChatRoomSchema
};