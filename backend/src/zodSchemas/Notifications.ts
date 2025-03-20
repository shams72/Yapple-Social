import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class NotificationSchemas {
  static createNotification = z.object({
    id: z.string().refine((id) => isValidObjectId(id), "Invalid user ID"),
    user: z.string().refine((id) => isValidObjectId(id), "Invalid user ID"),
    notificationType: z.enum([
      "new_post",
      "new_comment",
      "like_post",
      "like_comment",
      "reply_comment",
    ]),
    actor: z.string().refine((id) => isValidObjectId(id), "Invalid actor ID"),
    relatedEntity: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid relatedEntity ID"),
    createdAt: z.date().optional(),
    isRead: z.boolean().optional(),
  });

  static markNotificationAsRead = z.object({
    id: z.string().refine((id) => isValidObjectId(id), "Invalid user ID"),
    notificationId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid notification ID"),
  });

  static markAllNotificationAsRead = z.object({
    id: z.string().refine((id) => isValidObjectId(id), "Invalid user ID"),
  });
}
