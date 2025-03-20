import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const MessageSchemas = {
  getMessageByIdSchema: z.object({
    id: z.string().min(1, "Message ID is required"),
  }),

  createMessageSchema: z.object({
    to: z.string().min(1, "Recipient ID is required"),
    from: z.string().min(1, "Sender ID is required"),
    content: z.string().min(1, "Message content is required"),
  }),

  getMessagesBetweenUsersSchema: z.object({
    id: z.string().refine((id) => isValidObjectId(id), "Invalid user ID"),
    user1: z.string().min(1, "User 1 ID is required"),
    user2: z.string().min(1, "User 2 ID is required"),
  }),

  deleteMessageSchema: z.object({
    id: z.string().min(1, "Message ID is required"),
  }),
};
