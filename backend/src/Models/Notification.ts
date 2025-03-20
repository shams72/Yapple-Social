import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

export interface NotificationDocument extends Document {
  user: ObjectId;
  notificationType:
    | "new_post"
    | "new_comment"
    | "like_post"
    | "like_comment"
    | "reply_comment"
    | "new_vote";
  actor: ObjectId;
  relatedEntity: ObjectId;
  createdAt?: Date;
  isRead: boolean;
}

export class NotificationModel {
  model?: Model<NotificationDocument>;
  schema?: Schema<NotificationDocument>;

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Notification) {
      this.model = mongoose.model<NotificationDocument>("Notification");
    } else {
      this.schema = new mongoose.Schema<NotificationDocument>({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        notificationType: {
          type: String,
          enum: [
            "new_post",
            "new_comment",
            "like_post",
            "like_comment",
            "reply_comment",
            "new_vote"
          ],
          required: true,
        },
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        relatedEntity: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Posts",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      });

      this.model = mongoose.model("Notification", this.schema);
    }
  }

  public async createNotification(notification: NotificationDocument) {
    return await this.model?.create(notification);
  }

  public async getNotifications(userId: string) {
    return await this.model
      ?.find({ user: userId})
      .where("isRead").equals(false)
      .populate("actor") 
      .populate("relatedEntity");
  }

  public async markNotificationAsRead(notificationId: ObjectId) {
    await this.model?.findByIdAndUpdate(
      { _id: notificationId },
      { $set: { isRead: true } }
    );
  }

  public async markAllNotificationsAsRead(userId: ObjectId) {
    await this.model?.updateMany(
      { user: userId },  
      { $set: { isRead: true } } 
    );
  }

  public async deleteNotification(notificationId: ObjectId) {
    await this.model?.findOneAndDelete({ _id: notificationId });
  }
}
